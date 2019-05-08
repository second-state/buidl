<template>
  <div class="polygon-loader">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style lang="stylus">

$red-01 = #210008
$red-02 = #520019
$red-03 = #7b0029
$red-04 = #a5003a
$size = 64px

$totalWidth = $size
$totalHeight = $size
$topOffset = $size / 2
$leftOffset = $size / 2
$borderWidth = $size / 2

@keyframes type-01
  0%
    border-top-width: 0
    border-right-width: $borderWidth
    border-bottom-width: $borderWidth
    border-left-width: 0
  40%
    border-top-width: 0
    border-right-width: $borderWidth
    border-bottom-width: $borderWidth
    border-left-width: 0
  45%
    border-top-width: $borderWidth
    border-right-width: $borderWidth
    border-bottom-width: $borderWidth
    border-left-width: 0
  100%
    border-top-width: $borderWidth
    border-right-width: $borderWidth
    border-bottom-width: $borderWidth
    border-left-width: 0

.polygon-loader
  position: absolute
  top: 50%
  left: 50%
  margin: -($totalHeight/2) 0 0 -($totalWidth/2)
  height: $totalHeight
  width: $totalWidth
  div
    position: absolute
    top: $topOffset
    left: $leftOffset
    border: 0 solid transparent
    transform-origin: left top
    animation-duration: 4s
    animation-iteration-count: infinite
    animation-direction: alternate
    animation-timing-function: steps(4)
  div:nth-of-type(1)
    border-top-color: $red-01
    transform: rotate(-180deg)
    animation-name: type-01
  div:nth-of-type(2)
    border-top-color: $red-02
    transform: rotate(-90deg)
    animation-name: type-01
    animation-delay: 1s
  div:nth-of-type(3)
    border-top-color: $red-03
    transform: rotate(0)
    animation-name: type-01
    animation-delay: 2s
  div:nth-of-type(4)
    border-top-color: $red-04
    transform: rotate(90deg)
    animation-name: type-01
    animation-delay: 3s
</style>
