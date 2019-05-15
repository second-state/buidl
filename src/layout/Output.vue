<template>
  <div class="output">
    <slot></slot>
  </div>
</template>

<style lang="stylus">
@import "../assets/themes/light.styl"

.output
  height 200px
  border-top 1px solid $borderColor
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"

body.dark-theme
  .output
    border-color $borderColor
</style>
