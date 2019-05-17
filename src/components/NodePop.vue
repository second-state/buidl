<template>
  <div class="node-pop"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class NodePop extends Vue {}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

.node-pop
  position absolute
  width 400px
  height 200px
  box-shadow  0 1px 6px alpha($color, 0.3)
  background-color $backgroundColor
  border-radius 4px
  z-index 2
  top -140px
  cursor default
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
body.dark-theme
  .node-pop
    box-shadow  0 1px 6px alpha($color, 0.3)
    background-color $backgroundColor
</style>
