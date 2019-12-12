<template>
  <div>
    <div class="bg-mask"></div>
    <div class="tutorial-dialog">
      <h3>Select a sample project</h3>

      <div class="tutorials">
        <div class="tutorials-list">
          <ul>
            <li
              v-for="(v, k) in tutorials"
              :key="k"
              :value="k"
              :class="{ selected: k === selectedTutorial }"
              @click="selectedTutorial = k"
            >
              {{ tutorials[k].title }}
            </li>
          </ul>
        </div>
        <div class="tutorial-intro">
          <div v-if="selectedTutorial">
            {{ tutorials[selectedTutorial].intro }}
          </div>
        </div>
      </div>

      <div class="buttons">
        <button class="cancel" @click="cancel">Cancel</button>
        <button class="apply" @click="apply">
          Apply
        </button>
      </div>

      <div v-if="loading" class="dialog-mask">
        <Loading :baseSize="16" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Loading from "./Loading.vue";

@Component({
  components: {
    Loading
  },
  props: {
    tutorials: Object
  }
})
export default class Tutorial extends Vue {
  private tutorials: Object | undefined;
  private selectedTutorial: String | undefined;
  private loading: boolean;

  constructor() {
    super();
    this.loading = false;
    for (let k in this.tutorials) {
      this.selectedTutorial = k;
      break;
    }
  }

  cancel() {
    this.$emit("hide");
  }

  apply() {
    this.loading = true;
    this.$emit("apply", this.selectedTutorial);
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"
@import "../assets/var.styl"
.bg-mask
  position fixed
  top 0
  left 0
  height 100vh
  width 100vw
  background-color rgba($color, 0.3)
  z-index 100
.tutorial-dialog
  position absolute
  top 0
  background-color $backgroundColor
  z-index 101
  width 50vw
  padding 2rem
  left 25vw
  h3
    font-size 1.1rem
    margin: 0.5rem 0
  .buttons
    display flex
    justify-content flex-end
    button
      margin-left 1rem
      &.cancel
        color lighten($color, 30)

  .tutorials
    height 200px
    display flex
    margin 20px 0
    border 1px dashed $borderColor
    .tutorials-list
      width 40%
      height 100%
      overflow-y scroll
      border-right 1px solid $borderColor
      background-color $secondaryBackgroundColor
      ul
        margin 0
        padding 0
        li
          position relative
          list-style none
          padding 0
          padding 20px 20px 20px 30px
          cursor pointer
          font-size 0.9em
          &.selected
            background-color $minorBackgroundColor
            &:before
              content '✔'
              position absolute
              left 10px
          &:hover
            background-color $minorBackgroundColor
    .tutorial-intro
      width 60%
      padding 14px 20px
      line-height 1.3
      overflow-y scroll
  .dialog-mask
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    background-color rgba($backgroundColor, 0.6)
    z-index 1
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"

body.dark-theme
  .bg-mask
    background-color rgba($color, 0.3)
  .tutorial-dialog
    background-color $backgroundColor
    .buttons
      button
        &.cancel
          color darken($color, 30)
    .tutorials
      border-color $borderColor
      .tutorials-list
        border-color $borderColor
        background-color $secondaryBackgroundColor
      ul
        li
          &.selected
            background-color $minorBackgroundColor
          &:hover
            background-color $minorBackgroundColor
    .dialog-mask
      background-color rgba($backgroundColor, 0.6)
</style>
