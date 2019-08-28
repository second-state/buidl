<template>
  <div class="deployed-contracts">
    <div class="contract" v-for="(c, cIndex) in contracts" :key="c.address">
      <h3 @click="toggleFuncs(cIndex)" :class="c.address ? 'ready' : ''">
        {{ c.name }}
        <span class="pending" v-if="!c.address">(Pending)</span>
      </h3>
      <div class="tx-hash" v-show="c.txHash" :title="c.txHash">
        <label>Tx:</label> {{ c.txHash }}
        <input :ref="`c${c.txHash}`" type="hidden" :value="c.txHash" />
        <div class="contract-op">
          <a @click="copy(c.txHash, $event)">Copy</a>
        </div>
      </div>
      <div class="addr" v-show="c.address" :title="c.address">
        <label>Addr:</label> {{ c.address }}
        <input :ref="`c${c.address}`" type="hidden" :value="c.address" />
        <div class="contract-op">
          <a @click="copy(c.address, $event)">Copy</a>
        </div>
      </div>
      <div
        class="contract-actions"
        v-show="c.address && shownFuncs.indexOf(cIndex) > -1"
      >
        <template v-for="(abi, aIndex) in c.abi">
          <div
            class="contract-action"
            v-if="abi.type === 'function' && abi.name !== ''"
            :key="`${abi.name}_${abi.inputs.length}`"
          >
            <h4>{{ abi.name }}</h4>
            <div
              class="action-input-item"
              v-for="input in abi.inputs"
              :key="`${abi.name}${input.name}`"
            >
              <input
                type="text"
                :ref="`${c.address}_${abi.name}_${input.name}`"
                :placeholder="input.name"
              />
            </div>
            <button v-if="abi.constant" @click="call(cIndex, aIndex)">
              Call
            </button>
            <button v-else @click="transact(cIndex, aIndex)">Transact</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Web3 from "web3-ss";
import { Component, Vue } from "vue-property-decorator";
import LityWeb3 from "@/services/web3";
import JSVM from "@/services/jsvm.ts";
@Component({
  components: {}
})
export default class Deployed extends Vue {
  shownFuncs: number[] = [];

  get contracts() {
    return this.$store.state.deployed.contracts;
  }

  copy(addr: string, e: any) {
    const input = (this.$refs[`c${addr}`] as any)[0];
    input.setAttribute("type", "text");
    input.select();
    document.execCommand("copy");
    input.setAttribute("type", "hidden");
    e.target.innerText = "Copied";
    setTimeout(() => {
      e.target.innerText = "Copy";
    }, 500);
  }

  toggleFuncs(cIndex: number) {
    const i = this.shownFuncs.indexOf(cIndex);
    if (i > -1) {
      this.shownFuncs.splice(i, 1);
    } else {
      this.shownFuncs.push(cIndex);
    }
  }

  newLityWeb3() {
    const provider = this.$store.state.prefs.web3Provider;
    const pUrl =
      provider.using !== ""
        ? provider.options[provider.using].url
        : provider.custom.url;
    return new LityWeb3(new Web3.providers.HttpProvider(pUrl), "Lity");
  }

  call(cIndex: number, aIndex: number) {
    const deployedContract = this.contracts[cIndex];

    let params = [];
    let inputTypes = [];
    let outputTypes = [];
    for (let input of deployedContract.abi[aIndex].inputs) {
      inputTypes.push(input.type);
      params.push(
        (this.$refs[
          `${deployedContract.address}_${deployedContract.abi[aIndex].name}_${
            input.name
          }`
        ] as any)[0].value
      );
    }
    for (let output of deployedContract.abi[aIndex].outputs) {
      outputTypes.push(output.type);
    }

    this.$store.dispatch(`events/setLityOutputTab`, "logs");

    switch (deployedContract.provider) {
      case "JavaScript VM":
        this.callJSVM(
          deployedContract,
          aIndex,
          params,
          inputTypes,
          outputTypes
        );
        break;
      case "Web3 Provider":
        this.callWeb3(deployedContract, aIndex, params);
        break;
      default:
        console.log("Provider not found");
        break;
    }
  }

  callJSVM(
    deployedContract: any,
    aIndex: number,
    params: any[],
    inputTypes: any[],
    outputTypes: any[]
  ) {
    this.$store.dispatch(
      "outputs/pushLityLogs",
      `Call {${deployedContract.abi[aIndex].name}} at
        ${deployedContract.address} returned:`
    );
    JSVM.call(
      deployedContract.address,
      deployedContract.abi[aIndex].name,
      params,
      inputTypes,
      outputTypes
    )
      .then(result => {
        if (result) this.$store.dispatch("outputs/pushLityLogs", result);
      })
      .catch(err => {
        this.$store.dispatch(
          "outputs/pushLityLogs",
          `<span class="error">${err}</span>`
        );
      });
  }

  callWeb3(deployedContract: any, aIndex: number, params: any) {
    const web3 = this.newLityWeb3();
    const contract = web3.ss.contract(deployedContract.abi);
    const instance = contract.at(deployedContract.address);
    const func = instance[deployedContract.abi[aIndex].name];
    this.$store.dispatch(
      "outputs/pushLityLogs",
      `Call {${deployedContract.abi[aIndex].name}} at
        ${deployedContract.address} returned:`
    );
    try {
      const result = func.apply(func, params);
      this.$store.dispatch("outputs/pushLityLogs", result);
    } catch (e) {
      this.$store.dispatch(
        "outputs/pushLityLogs",
        `<span class="error">${e}</span>`
      );
    }
  }

  transact(cIndex: number, aIndex: number) {
    const deployedContract = this.contracts[cIndex];

    let params = [];
    let inputTypes = [];
    let outputTypes = [];
    for (let input of deployedContract.abi[aIndex].inputs) {
      inputTypes.push(input.type);
      params.push(
        (this.$refs[
          `${deployedContract.address}_${deployedContract.abi[aIndex].name}_${
            input.name
          }`
        ] as any)[0].value
      );
    }
    for (let output of deployedContract.abi[aIndex].outputs) {
      outputTypes.push(output.type);
    }

    switch (deployedContract.provider) {
      case "JavaScript VM":
        this.transactJSVM(
          deployedContract,
          aIndex,
          params,
          inputTypes,
          outputTypes
        );
        break;
      case "Web3 Provider":
        this.transactWeb3(deployedContract, aIndex, params);
        break;
      default:
        console.log("Provider not found");
        break;
    }
  }

  transactJSVM(
    deployedContract: any,
    aIndex: number,
    params: any[],
    inputTypes: any[],
    outputTypes: any[]
  ) {
    JSVM.transact(
      deployedContract.address,
      deployedContract.abi[aIndex].name,
      params,
      inputTypes,
      outputTypes
    )
      .then(result => {
        if (result) this.$store.dispatch("outputs/pushLityLogs", result);
      })
      .catch(err => {
        this.$store.dispatch(
          "outputs/pushLityLogs",
          `<span class="error">${err}</span>`
        );
      });
  }

  transactWeb3(deployedContract: any, aIndex: number, params: any) {
    const web3 = this.newLityWeb3();
    const contract = web3.ss.contract(deployedContract.abi);
    const instance = contract.at(deployedContract.address);
    const func = instance[deployedContract.abi[aIndex].name];

    try {
      func.apply(func, params);
    } catch (e) {
      this.$store.dispatch(
        "outputs/pushLityLogs",
        `<span class="error">${e}</span>`
      );
    }
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

.deployed-contracts
  padding 1em 0
  height 100%
  overflow scroll
  .contract
    padding 1em 0 0
    font-size 0.9em
    &:first-child
      padding-top 0
    h3
      display inline-block
      padding 0
      margin 0 1rem 0.5em
      &.ready
        text-decoration underline
        cursor pointer
      .pending
        font-size 0.8em
        color rgba($color, 0.5)
    .addr, .tx-hash
      white-space nowrap
      position relative
      padding 0 1rem 1em
      overflow-x hidden
      text-overflow ellipsis
      label
        font-size 0.8em
        color rgba($color, 0.5)
      .contract-op
        display none
        position absolute
        font-size 0.8em
        color rgba($color, 0.5)
        a
          cursor pointer
          margin-right 1em
      &:hover
        .contract-op
          display block
    .contract-actions
      background-color $minorBackgroundColor
      box-shadow inset 0px 10px 10px -10px darken($minorBackgroundColor, 25%),
        inset 0px -10px 10px -10px darken($minorBackgroundColor, 25%)
      .contract-action
        padding 1em
        margin-bottom 1em
        &:last-child
          margin-bottom 0
      h4
        margin 0 0 1em
      .action-input-item
        margin 1em 0
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"

body.dark-theme
  .deployed-contracts
    .contract
      .addr, .tx-hash
        .contract-op, label
          color rgba($color, 0.5)
      .contract-actions
        background-color $minorBackgroundColor
        box-shadow inset 0px 10px 10px -10px darken($minorBackgroundColor, 25%),
          inset 0px -10px 10px -10px darken($minorBackgroundColor, 25%)
</style>
