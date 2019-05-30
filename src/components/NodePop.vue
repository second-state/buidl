<template>
  <div class="node-pop">
    <h3>Set Provider Endpoint</h3>
    <select v-model="using">
      <option value="">Customize</option>
      <option v-for="opt in provider.options" :key="opt" :value="opt">{{
        opt
      }}</option>
    </select>
    <input
      ref="customInput"
      placeholder="Your endpoint"
      v-show="using === ''"
      v-model="custom"
      v-on:blur="reCheckCustom"
    />
    <div class="status">
      <strong>Status: </strong>
      <span class="status-text" :class="provider.status">
        {{ provider.status }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { web3 } from "@/services/web3";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {}
})
export default class NodePop extends Vue {
  public using: string;
  public custom: string;
  private oldCustom: string | undefined = undefined;

  constructor() {
    super();
    this.using = this.$store.state.prefs.web3Provider.using;
    this.custom = this.$store.state.prefs.web3Provider.custom;
  }

  get provider() {
    return this.$store.state.prefs.web3Provider;
  }

  created() {
    this.reCheck();
  }

  @Watch("using")
  changeUsing(val: string) {
    if (val === "") {
      this.$nextTick().then(() => {
        (this.$refs.customInput as HTMLElement).focus();
      });
    } else {
      this.reCheck();
    }
    this.oldCustom = undefined;
  }

  reCheck() {
    this.$store.dispatch("prefs/setWeb3ProviderStatus", "pending");
    const url = this.using || this.custom;
    web3.checkProvider(url, (status: string) => {
      this.$store.dispatch("prefs/setWeb3ProviderStatus", status);
    });
  }

  reCheckCustom() {
    if (this.oldCustom !== this.custom) {
      this.reCheck();
      this.oldCustom = this.custom;
    }
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

.node-pop
  position absolute
  width 400px
  height 200px
  padding 1rem
  border 1px dashed alpha($color, 0.5)
  background-color $backgroundColor
  border-radius 4px
  z-index 2
  top -140px
  cursor default
  color $color
  font-size 1rem
  text-align left
  h3
    margin-top 0
    font-size 0.9em
  select
    margin-bottom 1em
  input
    border 0
    border-bottom 1px solid $color
    background-color transparent
    appearance none
    width 100%
    color $color
  .status
    position absolute
    bottom 1em
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
    input
      border-color $color
      color $color
</style>
