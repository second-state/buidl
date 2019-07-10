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
        ref="esCustomUrl"
        placeholder="Your endpoint"
        v-show="esUsing === ''"
        v-model="esCustomUrl"
      />
    </div>

    <div class="wrapper web3-wrapper">
      <h3>Set Web3 Provider Endpoint</h3>
      <select v-model="using">
        <option v-for="(opt, index) in options" :key="opt" :value="index">{{
          opt
        }}</option>
        <option value="">Customize</option>
      </select>
      <input
        ref="customUrl"
        placeholder="Your endpoint"
        v-show="using === ''"
        v-model="customUrl"
        v-on:blur="reCheckCustom"
      />
      <input
        ref="customChainId"
        placeholder="Your chainId"
        v-show="using === ''"
        v-model="customChainId"
      />
      <div class="status">
        <strong>Status: </strong>
        <span class="status-text" :class="status">
          {{ status }}
        </span>
        <span v-if="status === 'accessible'">@Height {{ providerHeight }}</span>
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
  private providerHeight: any;
  private checkCount: number = 0;

  constructor() {
    super();
    this.esUsing = this.$store.state.prefs.esProvider.using;
    this.esCustomUrl = this.$store.state.prefs.esProvider.custom.url;
    this.using = this.$store.state.prefs.web3Provider.using;
    this.customUrl = this.$store.state.prefs.web3Provider.custom.url;
    this.customChainId = this.$store.state.prefs.web3Provider.custom.chainId;
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
    web3.checkProvider(url, (status: string, result: object) => {
      if (cc === this.checkCount) {
        this.$store.dispatch("prefs/setWeb3ProviderStatus", status);
        if (status !== "invalid") {
          this.providerHeight = result;
          this.$forceUpdate();
          setTimeout(() => {
            this.doCheck(url, cc);
          }, this.$store.state.prefs.web3Provider.checkInterval);
        }
      }
    });
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
  height 320px
  border 1px dashed alpha($color, 0.5)
  background-color $backgroundColor
  border-radius 4px
  z-index 2
  top -260px
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
