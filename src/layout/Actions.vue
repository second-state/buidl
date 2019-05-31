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
    border-radius 0
    box-shadow none !important
    margin 0
    padding 0 1em
    &:disabled
      color rgba($color, 0.5)
      cursor not-allowed
    [class^="icon-"]
      margin-right 0.5em
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"

body.dark-theme
  .actions
    background-color $minorBackgroundColor
    button
      &:disabled
        color rgba($color, 0.5)
</style>
