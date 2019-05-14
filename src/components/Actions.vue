<template>
  <div class="actions">
    <slot></slot>
  </div>
</template>

<style lang="stylus">
.actions
  position absolute
  font-size 1em
  line-height 59px
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
