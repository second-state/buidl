<template>
  <div :style="{ 'font-size': baseSize + 'px' }" class="square-loader">
    <div></div>
    <div></div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    baseSize: {
      type: Number,
      required: true
    }
  }
};
</script>

<style lang="stylus">

$red = #d24242
$green = #20c370
$size = 1em

@keyframes type-01
  0%
    top $size
    z-index 1
  20%
    top - $size
  50%
    top 0
  70%
    top 0
  100
    top $size

@keyframes type-02
  0%
    top 0
  20%
    top 0
  50%
    top $size
    z-index 1
  70%
    top - $size
  100
    top 0


.square-loader
  position absolute
  top 50%
  left 50%
  margin - $size 0 0 ($size / -2)
  height $size * 2
  width $size
  div
    position absolute
    width $size
    height $size
    top 0
    left 0
    animation-duration 2s
    animation-iteration-count infinite
  div:nth-of-type(1)
    top $size
    background-color $red
    animation-name type-01
  div:nth-of-type(2)
    background-color $green
    animation-name type-02
</style>
