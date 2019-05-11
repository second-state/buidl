<template>
  <div class="actions">
    <slot></slot>
  </div>
</template>

<style lang="stylus">
.actions
  padding-left 200px
  font-size 1em
  line-height 40px
  border-bottom 1px solid #eeeeee
  box-shadow 0 2px 3px #eeeeee
  button
    border 0
    background-color transparent
    margin 0 1em
    padding 0
    cursor pointer
    [class^="icon-"]
      margin-right 0.5em
</style>
