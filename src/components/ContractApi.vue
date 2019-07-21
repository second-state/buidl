<template>
  <div class="contract-api">
    <div class="contract" v-for="(c, cIndex) in contracts" :key="c.address">
      <h3 @click="toggleFuncs(cIndex)">{{ c.name }}</h3>
      <button
        class="icon-play3"
        :class="
          $store.state.events.usingDeployedContract &&
          $store.state.events.usingDeployedContract.address === c.address
            ? 'using'
            : ''
        "
        @click="use(c)"
      ></button>
      <div class="addr" v-show="c.address" :title="c.address">
        {{ c.address }}
        <input :ref="`c${c.address}`" type="hidden" :value="c.address" />
        <div class="contract-op">
          <a @click="copy(c.address, $event)">Copy</a>
        </div>
      </div>
      <div class="contract-actions" v-show="shownFuncs.indexOf(cIndex) > -1">
        <div
          class="contract-action"
          v-for="abi in c.abi"
          :key="`${abi.name}_${abi.inputs.length}`"
        >
          <div v-if="abi.type === 'function'">
            <h4 :class="abi.constant ? 'view' : ''">{{ abi.name }}</h4>
            <ul
              class="action-input-item"
              v-for="input in abi.inputs"
              :key="`${abi.name}${input.name}`"
            >
              <li>{{ input.name }}: {{ input.type }}</li>
            </ul>
            <ul
              class="action-output-item"
              v-for="(output, oIndex) in abi.outputs"
              :key="`${abi.name}${oIndex}`"
            >
              <li>{{ output.name }}: {{ output.type }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Web3 from "web3-ss";
import { Component, Vue } from "vue-property-decorator";
import LityWeb3 from "@/services/web3";
import { DeployedContract } from "@/modules/deployed";
@Component({
  components: {}
})
export default class ContractApi extends Vue {
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

  use(c: DeployedContract) {
    this.$store.dispatch("events/setUsingDeployedContract", c);
    this.$store.dispatch("events/triggerReuseDeployedContract");
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

.contract-api
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
      text-decoration underline
      cursor pointer
      + button
        display none
        float right
        margin-right 1rem
        &.using
          display inline
          background-color invert($backgroundColor)
          color invert($color)
    .addr
      position relative
      padding 0 1rem 1em
      overflow-x hidden
      text-overflow ellipsis
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
      h4
        margin 0 0 1em
        &.view
          color lighten($color, 25%)
      .action-input-item, .action-output-item
        margin 1em 0
      .action-output-item
        list-style-type circle
    &:hover
      h3
        + button
          display inline
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"

body.dark-theme
  .contract-api
    .contract
      h3
        + button
          &.using
            background-color invert($backgroundColor)
            color invert($color)
      .addr
        .contract-op
          color rgba($color, 0.5)
      .contract-actions
        background-color $minorBackgroundColor
        box-shadow inset 0px 10px 10px -10px darken($minorBackgroundColor, 25%),
          inset 0px -10px 10px -10px darken($minorBackgroundColor, 25%)
        h4
          &.view
            color darken($color, 25%)
</style>
