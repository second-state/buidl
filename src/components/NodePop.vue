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
    border 0
    border-bottom 1px solid $color
    border-radius 0
    background-color transparent
    appearance none
    width 100%
    background-image url(replace(__color__, replace("#", "", s("%s", rgb($color))), "data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23__color__%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"))
    background-repeat no-repeat
    background-position right .5em top 50%, 0 0
    background-size .65em auto, 100%
    color $color
    margin-bottom 1em
  select::-ms-expand
	  display none
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
    select
      border-color $color
      background-image url(replace(__color__, replace("#", "", s("%s", rgb($color))), "data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23EEEEEE%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"))
      color $color
    input
      border-color $color
      color $color
</style>
