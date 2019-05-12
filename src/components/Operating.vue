<template>
  <div class="operating">
    <div class="left">
      <slot></slot>
    </div>
    <div class="right"></div>
  </div>
</template>

<style lang="stylus">
.operating
  height 100%
  .left, .right
    width 50%
    height 100%
  .left
    border-right 1px solid #cccccc
</style>
