<template>
  <div class="actions">
    <slot></slot>
  </div>
</template>

<style lang="stylus">
@import "../assets/var.styl"

.actions
  position absolute
  font-size 1em
  line-height $sideBarWidth
  height $sideBarWidth
  width 100%
  border-bottom 1px solid #eeeeee
  button
    border 0
    background-color transparent
    margin 0 1em
    padding 0
    cursor pointer
    [class^="icon-"]
      margin-right 0.5em
</style>
