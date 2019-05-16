<template>
  <div class="output">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Output extends Vue {}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

.output
  height 200px
  border-top 1px solid $borderColor
  padding 3px 0 0 20px
  font-size 0.8em
  .tabs
    height 100%
    display flex
    flex-direction column
    .tabs-content
      flex-grow 1
    .tabs-tabpane
      height 100%
      overflow-y scroll
      padding-right 20px
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"

body.dark-theme
  .output
    border-color $borderColor
</style>
