<template>
  <div class="actions">
    <slot></slot>
  </div>
</template>

<style lang="stylus">
@import "../assets/themes/light.styl"
@import "../assets/var.styl"

.actions
  position fixed
  font-size 1em
  line-height $sideBarWidth
  height $sideBarWidth
  left $sideBarWidth
  right 0
  z-index 99
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
