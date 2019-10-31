<template>
  <div class="actions">
    <slot></slot>
    <a href="https://www.secondstate.io/buidl/" target="_blank">
      <svg style="position: fixed; right: 20px; top: 5px;" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        height="50px" viewBox="0 0 512 512" width="50px" xml:space="preserve">
      <path class="st0" d="M224,111.9l-13.9-52.3c-4.7-17.8,1.3-36.8,15.4-48.6s33.8-14.4,50.5-6.6c16.7,7.8,27.4,24.5,27.4,43
        c0,4.1-0.5,8.3-1.6,12.3L288,111.9" fill="#4C8056"/>
      <path class="st1" d="M343.2,156.4c15.1-12.8,34.2-20,54-20.4c63.4,0,114.8,77.5,114.8,173c0,95.5-51.4,173-114.8,173
        c-19.8-0.3-38.9-7.5-54-20.4H168.8c-15.1,12.8-34.2,20-54,20.4C51.4,481.9,0,404.5,0,309c0-95.5,51.4-173,114.8-173
        c19.8,0.3,38.9,7.5,54,20.4H343.2z" fill="#E58025"/>
      <g>
        <path class="st2" d="M388.4,309c0-112.1-59.3-203-132.4-203s-132.4,90.9-132.4,203S182.9,512,256,512S388.4,421.1,388.4,309z" fill="#F2B71F"/>
        <path class="st2" d="M96,169.4c-16.3-7.8-42.2,12.7-58,45.7c-15.7,33-15.3,66.1,1,73.8c16.3,7.8,42.2-12.7,58-45.7
          C112.7,210.2,112.3,177.1,96,169.4z" fill="#F2B71F"/>
        <path class="st2" d="M474,215.1c-15.7-33-41.7-53.5-58-45.7c-16.3,7.8-16.7,40.8-1,73.8s41.7,53.5,58,45.7
          C489.3,281.1,489.7,248.1,474,215.1z" fill="#F2B71F"/>
      </g>
      <path class="st3" d="M160.3,236.7v20.7c-0.1,7.6,6,13.8,13.6,13.9h56.2c2.6,0,5-1.6,6.2-4c1.1-2.4,0.8-5.2-0.8-7.3
        c-8.7-11.7-28.2-28.6-68.2-30.3c-1.8,0-3.6,0.7-4.9,2C161,233,160.3,234.8,160.3,236.7z" fill="#2C3E50"/>
      <path class="st3" d="M351.7,236.7v20.7c0.1,7.6-6,13.8-13.6,13.9h-56.2c-2.6,0-5-1.6-6.2-4c-1.1-2.4-0.8-5.2,0.8-7.3
        c8.7-11.7,28.2-28.6,68.2-30.3c1.8,0,3.6,0.7,4.9,2C351,233,351.7,234.8,351.7,236.7z" fill="#2C3E50"/>
      <path class="st3" d="M256,418c-13.1,0-26.2-1.8-38.8-5.4c-11.7-3.3-22.9-8.4-33-15.2c-9.7-6.5-18-14.9-24.2-24.7
        c-6.2-9.9-3.1-23,6.8-29.2s23-3.1,29.2,6.8c3.2,4.8,7.3,8.9,12.1,12c6.4,4.3,13.5,7.5,20.9,9.5c17.7,4.9,36.5,4.9,54.2,0
        c7.4-2.1,14.5-5.3,20.9-9.5c4.8-3.1,8.9-7.2,12.1-12c6.2-9.9,19.2-13,29.2-6.8c9.9,6.2,13,19.2,6.8,29.2
        c-6.3,9.8-14.5,18.3-24.2,24.7c-10.1,6.8-21.3,11.9-33.1,15.2C282.2,416.2,269.1,418.1,256,418z" fill="#2C3E50"/>
      </svg>

    </a>
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
  position relative
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
    &:hover
      label
        cursor pointer
        box-shadow 0 1px 0px 0px $color
    &:disabled:hover
      label
        cursor not-allowed
        box-shadow none
    &.danger
      color $red
      &:hover
        label
          box-shadow 0 1px 0px 0px $red
    label
      position relative
      sub
        position absolute
        left 0
        top 1.6rem
        &.error
          color $red
        a
          position relative
          color $color
          &:hover
            &:before
              content ''
              position absolute
              width 200%
              height 1px
              top -1px
              background-color $minorBackgroundColor
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
@import "../assets/var.styl"

body.dark-theme
  .actions
    background-color $minorBackgroundColor
    button
      &:disabled
        color rgba($color, 0.5)
      &:hover
        label
          box-shadow 0 1px 0px 0px $color
      &:disabled:hover
        label
          box-shadow none
      &.danger
        &:hover
          label
            box-shadow 0 1px 0px 0px $red
      label
        sub
          a
            color $color
            &:hover
              &:before
                background-color $minorBackgroundColor
</style>
