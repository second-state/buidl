<template>
  <div class="node-pop">
    <div class="wrapper es-wrapper">
      <h3>Set ES Provider Endpoint</h3>
      <select v-model="esUsing">
        <option v-for="(opt, index) in esOptions" :key="opt" :value="index">{{
          opt
        }}</option>
        <option value="">Customize</option>
      </select>
      <input
        type="text"
        ref="esCustomUrl"
        placeholder="Your endpoint"
        v-show="esUsing === ''"
        v-model="esCustomUrl"
      />
    </div>

    <div class="wrapper web3-wrapper">
      <h3>Set Web3 Provider Endpoint</h3>
      <select ref="web3Using" v-model="using">
        <option v-for="(opt, index) in options" :key="opt" :value="index">{{
          opt
        }}</option>
        <option value="">Customize</option>
      </select>
      <input
        type="text"
        ref="customUrl"
        placeholder="Your endpoint"
        v-show="using === ''"
        v-model="customUrl"
        v-on:blur="reCheckCustom"
      />
      <input
        type="text"
        ref="customChainId"
        placeholder="Your chainId"
        v-show="using === ''"
        v-model="customChainId"
      />
      <div class="custom-gas" v-show="using === ''">
        <div class="custom-gas-toggle">
          <label>
            <input type="checkbox" v-model="customGas" />
            Custom Tx Gas
          </label>
        </div>
        <div class="custom-gas-fields">
          <input
            type="text"
            placeholder="Gas Price"
            v-show="customGas === true"
            v-model="customGasPrice"
          />
          <input
            type="text"
            placeholder="Gas Limit"
            v-show="customGas === true"
            v-model="customGasLimit"
          />
        </div>
      </div>
      <div class="status">
        <strong>Status: </strong>
        <span class="status-text" :class="status">
          {{ status }}
        </span>
        <span v-show="status === 'accessible'">@Height <span ref="providerHeight"></span></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { web3 } from "@/services/web3";
import { Web3Provider, ESProvider } from "@/modules/prefs";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {}
})
export default class NodePop extends Vue {
  public esUsing: string;
  public esCustomUrl: string;
  public using: string;
  public customUrl: string;
  public customChainId: string;
  private oldCustomUrl: String | undefined = undefined;
  private customGas: boolean;
  private customGasPrice: string;
  private customGasLimit: string;
  private checkCount: number = 0;

  constructor() {
    super();
    this.esUsing = this.$store.state.prefs.esProvider.using;
    this.esCustomUrl = this.$store.state.prefs.esProvider.custom.url;
    this.using = this.$store.state.prefs.web3Provider.using;
    // reset metamask using
    if (
      Number(this.using) === this.$store.state.prefs.web3Provider.options.length
    ) {
      this.using = "" + (Number(this.using) - 1);
      this.$store.dispatch(
        "prefs/setWeb3ProviderUsingWithoutMetaMask",
        this.using
      );
    }
    this.customUrl = this.$store.state.prefs.web3Provider.custom.url;
    this.customChainId = this.$store.state.prefs.web3Provider.custom.chainId;
    this.customGas =
      this.$store.state.prefs.web3Provider.custom.customGas || false;
    this.customGasPrice =
      this.$store.state.prefs.web3Provider.custom.gasPrice || "";
    this.customGasLimit =
      this.$store.state.prefs.web3Provider.custom.gasLimit || "";

    this.$store.watch(
      () => {
        return this.$store.state.prefs.web3Provider.using;
      },
      using => {
        if (using !== this.using) {
          this.using = using;
          this.$nextTick().then(() => {
            (this.$refs.web3Using as HTMLSelectElement).selectedIndex = 1;
          });
        }
      }
    )
  }

  get status() {
    return this.$store.state.prefs.web3Provider.status;
  }

  get options() {
    return this.$store.state.prefs.web3Provider.options.map(
      (c: Web3Provider) => c.url
    );
  }

  get esOptions() {
    return this.$store.state.prefs.esProvider.options.map(
      (c: ESProvider) => c.url
    );
  }

  created() {
    this.reCheck();
  }

  @Watch("esUsing")
  changeESUsing(val: string) {
    if (val === "") {
      this.$nextTick().then(() => {
        (this.$refs.esCustomUrl as HTMLElement).focus();
      });
    }
  }

  @Watch("using")
  changeUsing(val: string) {
    if (val === "") {
      this.$nextTick().then(() => {
        (this.$refs.customUrl as HTMLElement).focus();
      });
    } else {
      this.reCheck();
    }
    this.oldCustomUrl = undefined;
  }

  reCheck() {
    this.checkCount++;
    this.$store.dispatch("prefs/setWeb3ProviderStatus", "pending");
    const url =
      this.using !== ""
        ? this.$store.state.prefs.web3Provider.options[this.using].url
        : this.customUrl;
    this.doCheck(url, this.checkCount);
  }

  doCheck(url: string, cc: number) {
    const provider = this.$store.state.prefs.web3Provider;
    const interval =
      (provider.using !== "" && !provider.usingMetaMask) ||
      !provider.custom.customGas
        ? provider.confirmInterval
        : provider.extendConfirmInterval;
    web3.checkProvider(
      url,
      cc,
      (status: string, icc: number, result: object) => {
        if (icc === this.checkCount) {
          this.checkCount++;
          icc = this.checkCount;
          this.$store.dispatch("prefs/setWeb3ProviderStatus", status);
          if (status !== "invalid") {
            this.$nextTick().then(() => {
              (this.$refs.providerHeight as Element).textContent = result.toString();
            });
            setTimeout(() => {
              this.doCheck(url, icc);
            }, interval);
          }
        }
      }
    );
  }

  reCheckCustom() {
    if (this.oldCustomUrl !== this.customUrl) {
      this.reCheck();
      this.oldCustomUrl = this.customUrl;
    }
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

.node-pop
  position absolute
  width 400px
  height 360px
  border 1px dashed alpha($color, 0.5)
  background-color $backgroundColor
  border-radius 4px
  z-index 2
  top -360px
  cursor default
  color $color
  font-size 1rem
  text-align left
  display flex
  flex-direction column
  justify-content space-between
  .wrapper
    padding 1rem
    &.web3-wrapper
      background-color $minorBackgroundColor
  h3
    margin-top 0
    font-size 0.9em
  select
    margin-bottom 1em
  .custom-gas
    .custom-gas-toggle
      padding 0.2em 0
      label
        position relative
        display inline
        font-size 0.8em
    .custom-gas-fields
      display flex
      justify-content space-between
      input
        width 45%
  .status
    margin-top 1em
    .status-text
      color gray
      text-transform capitalize
      &.pending
        color #ffa500
      &.accessible
        color #008000
      &.unreachable
        color #f00
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
body.dark-theme
  .node-pop
    border-color alpha($color, 0.5)
    background-color $backgroundColor
    color $color
    .wrapper
      &.web3-wrapper
        background-color $minorBackgroundColor
</style>
