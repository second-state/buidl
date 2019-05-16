<template>
  <div class="actions">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Actions extends Vue {}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"
@import "../assets/var.styl"

.actions
  font-size 1em
  line-height $sideBarWidth
  background-color $minorBackgroundColor
  button
    border 0
    background-color transparent
    margin 0 1em
    padding 0
    cursor pointer
    [class^="icon-"]
      margin-right 0.5em
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"

body.dark-theme
  .actions
    background-color $minorBackgroundColor
</style>
