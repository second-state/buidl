<template>
  <div
    class="problems"
    v-html="'<p>' + problems.join('</p><p>') + '</p>'"
  ></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Problems extends Vue {
  private problems: string[];

  public constructor() {
    super();
    this.problems = this.$store.state.outputs.problems;
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

.problems
  color $color
p
  margin 0 0 1em
  word-break break-all
  line-height 1.4
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
body.dark-theme
  .problems
    color $color
</style>
