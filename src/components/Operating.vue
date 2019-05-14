<template>
  <div class="operating">
    <slot></slot>
  </div>
</template>

<style lang="stylus">
@import "../assets/var.styl"

.operating
  height 100%
  padding-top $sideBarWidth
</style>
