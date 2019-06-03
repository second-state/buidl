<template>
  <div class="deployed-contracts">
    <div class="contract" v-for="c in contracts" :key="c.address">
      <h4>{{ c.name }}</h4>
      <div class="addr">
        {{ c.address }}
        <input :ref="`c${c.address}`" type="hidden" :value="c.address" />
        <div>
          <a @click="copy(c.address, $event)">Copy</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Deployed extends Vue {
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
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

.deployed-contracts
  padding 1em
  height 100%
  overflow scroll
  .contract
    padding 1em 0
    font-size 0.9em
    &:first-child
      padding-top 0
    h4
      margin 0 0 0.5em
    .addr
      overflow hidden
      text-overflow ellipsis
      a
        display none
        position absolute
        font-size 0.8em
        color rgba($color, 0.5)
        cursor pointer
    &:hover
      .addr
        a
          display inline
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
</style>
