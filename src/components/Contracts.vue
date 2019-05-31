<template>
  <div class="contracts">
    <div class="none" v-if="contractNames.length === 0">
      No contract has been compiled.
    </div>
    <template v-else>
      <div>
        <select v-model="selectedContract">
          <option v-for="n in contractNames" :key="n" :value="n">
            {{ n }}
          </option>
        </select>
      </div>
      <div>
        <div
          class="constructor-inputs"
          v-if="contractConstructorInputs.length > 0"
        >
          <div
            class="constructor-input-item"
            v-for="input in contractConstructorInputs"
            :key="input.name"
          >
            <label>{{ input.name }}</label>
            <input type="text" :placeholder="input.type" />
          </div>
        </div>
        <button @click="deploy">
          <span class="icon-cogs"></span> Deploy to the chain
        </button>
      </div>
      <div class="abi">
        <h4>ABI <span @click="copyAbi($event)">Copy</span></h4>
        <pre>{{ contract.abi }}</pre>
        <textarea
          ref="abi"
          :value="JSON.stringify(contract.abi, null, 2)"
          style="display:none"
        />
      </div>
      <div class="bytecode">
        <h4>BYTECODE <span @click="copyByteCode($event)">Copy</span></h4>
        <pre>{{ contract.evm.bytecode.object }}</pre>
        <textarea
          ref="bytecode"
          :value="contract.evm.bytecode.object"
          style="display:none"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import LityWeb3 from "@/services/web3";
import Web3 from "web3-cmt";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Contracts extends Vue {
  private selectedContract: string = "";

  get contractNames() {
    let names: string[] = [];
    let i = 0;
    for (const n in this.$store.state.contracts.contracts) {
      names.push(n);
      if (i === 0) {
        this.selectedContract = n;
      }
      i++;
    }
    return names;
  }

  get contract() {
    return this.$store.state.contracts.contracts[this.selectedContract];
  }

  get contractConstructorInputs() {
    const abi = this.contract.abi;
    for (let i = 0; i < abi.length; i++) {
      if (abi[i].type === "constructor") {
        return abi[i].inputs || [];
      }
    }
    return [];
  }

  deploy() {
    const provider = this.$store.state.prefs.web3Provider;
    const pUrl =
      provider.using !== ""
        ? provider.options[provider.using].url
        : provider.custom.url;
    const web3 = new LityWeb3(new Web3.providers.HttpProvider(pUrl));
    const contract = web3.lity.contract(this.contract.abi);
    const instance = contract.new({
      data: `0x${this.contract.evm.bytecode.object}`
    });
  }

  copyAbi(e: any) {
    this.copy("abi", e);
  }

  copyByteCode(e: any) {
    this.copy("bytecode", e);
  }

  copy(c: string, e: any) {
    const ta = this.$refs[c] as any;
    ta.setAttribute("style", "display:inline");
    ta.select();
    document.execCommand("copy");
    ta.setAttribute("style", "display:none");
    e.target.innerText = "Copied";
    setTimeout(() => {
      e.target.innerText = "Copy";
    }, 500);
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

.contracts
  height 100%
  padding 1em
  overflow scroll
  .none
    margin 1em
    text-align center
    font-size 0.9em
    font-style italic
  select
    margin-bottom 1em
  button
    font-size 0.9em

  h4
    margin 1em 0
    span
      font-weight normal
      font-size 0.8em
      float right
      cursor pointer
  pre
    font-family inherit
    font-size 0.9em

  .constructor-inputs
    .constructor-input-item
      display flex
      flex-direction column
      margin-bottom 0.5em
      label
        color alpha($color, 0.8)
        font-size 0.8em
      input
        font-size 0.8em
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
</style>
