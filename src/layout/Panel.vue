<template>
  <div class="panel">
    <ResizeBar resize-direction="horizontal"></ResizeBar>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ResizeBar from "@/components/ResizeBar.vue";

@Component({
  components: {
    ResizeBar
  }
})
export default class Panel extends Vue {}
</script>

<style lang="stylus">
@import "../assets/var.styl"
@import "../assets/themes/light.styl"

.panel
  position relative
  min-width 300px
  width 300px
  background-color $secondaryBackgroundColor
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"

body.dark-theme
  .panel
    background-color $secondaryBackgroundColor
</style>
