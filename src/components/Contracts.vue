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
            <input type="text" :ref="input.name" :placeholder="input.name" />
          </div>
        </div>
        <button @click="deploy">
          <span class="icon-cogs"></span> Deploy to the chain
        </button>
        or
      </div>
      <div>
        <input type="text" class="at-addr" v-model="atAddr" placeholder="0x" />
        <button @click="at">At</button>
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
import Web3 from "web3-ss";
import { Component, Vue, Watch } from "vue-property-decorator";
import LityWeb3 from "@/services/web3";
const ES = require("@/modules/es-ss.js");

@Component({
  components: {}
})
export default class Contracts extends Vue {
  private selectedContract: string = "";
  private atAddr: string = "";

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

  @Watch("contract")
  onContractChange(contract: object, oldContract: object) {
    if (contract && this.$store.state.deployed.contracts.length == 0) {
      const c = {
        abi: (contract as any).abi,
        bytecode: (contract as any).evm.bytecode.object,
        address: ""
      };
      this.$store.dispatch("events/setCompiledContract", c);
    }
  }

  newLityWeb3() {
    const provider = this.$store.state.prefs.web3Provider;
    const pUrl =
      provider.using !== ""
        ? provider.options[provider.using].url
        : provider.custom.url;
    return LityWeb3(new Web3.providers.HttpProvider(pUrl), "Lity");
  }

  newEs() {
    const provider = this.$store.state.prefs.esProvider;
    const pUrl =
      provider.using !== ""
        ? provider.options[provider.using].url
        : provider.custom.url;
    if (pUrl !== "") {
      return new ES(pUrl);
    } else {
      return null;
    }
  }

  deploy() {
    let params = [];
    for (let input of this.contractConstructorInputs) {
      let v = (this.$refs[input.name] as any)[0].value;
      if (input.type.indexOf("[]") > 0) {
        try {
          v = JSON.parse(v);
        } catch (e) {
          this.$store.dispatch("outputs/pushProblems", e);
          this.$store.dispatch(`events/setLityOutputTab`, "problems");
          return;
        }
      }
      params.push(v);
    }
    params.push({
      data: `0x${this.contract.evm.bytecode.object}`
    });
    params.push(this.deployed);

    const web3 = this.newLityWeb3();
    const contract = web3.ss.contract(this.contract.abi);
    contract.new.apply(contract, params);
  }

  deployed(err: any, contract: any) {
    if (err) {
      console.error(err);
      return;
    }
    const c = {
      name: this.selectedContract,
      abi: this.contract.abi,
      bytecode: this.contract.evm.bytecode.object,
      address: contract.address || "",
      txHash: contract.transactionHash
    };
    if (!contract.address) {
      if (this.$store.state.deployed.contracts.length == 0) {
        this.$store.dispatch("events/setFirstDeployedContract", c);
      }
      this.$store.dispatch("deployed/pushContract", c);
      this.$store.dispatch("events/setLityPanel", "Deployed");
    } else {
      this.$store.dispatch("deployed/updateContractAddress", c);
      if (this.$store.state.deployed.contracts.length == 1) {
        this.$store.dispatch("events/setFirstDeployedContract", c);
      }
      const es = this.newEs();
      if (es != null) {
        const abis = {};
        const abisLog = {};
        let i = 0;
        for (const n in this.$store.state.contracts.contracts) {
          (abis as any)[i] = {
            abi: this.$store.state.contracts.contracts[n].abi
          };
          (abisLog as any)[n] = {
            abi: JSON.stringify(this.$store.state.contracts.contracts[n].abi)
          };
          ++i;
        }
        es.submitManyAbis(abis, contract.transactionHash).then(
          (result: any) => {
            this.$store.dispatch(
              `outputs/pushLityLogs`,
              `New abis were submitted to es: <br/>\
              ${JSON.stringify(abisLog, null, "  ")
                .replace(/\n/g, "<br/>")
                .replace(/\s\s/g, "&nbsp;&nbsp;")}`
            );
          }
        );
      }
    }
  }

  at() {
    if (/^0x[0-9a-zA-Z]{40}$/g.test(this.atAddr)) {
      const c = {
        name: this.selectedContract,
        abi: this.contract.abi,
        bytecode: this.contract.evm.bytecode.object,
        address: this.atAddr
      };
      if (this.$store.state.deployed.contracts.length == 0) {
        this.$store.dispatch("events/setFirstDeployedContract", c);
      }
      this.$store.dispatch("deployed/pushContract", c);
      this.$store.dispatch("events/setLityPanel", "Deployed");
    } else {
      alert("Invalid address");
    }
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
      input
        font-size 0.8em
  .at-addr
    margin 0.5em 0
    font-size 0.8em
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
</style>
