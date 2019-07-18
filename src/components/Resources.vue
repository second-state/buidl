<template>
  <div class="resources">
    <div class="res-actions">
      <h3>Javascript</h3>
      <button @click="newJs" title="New Javascript">+</button>
    </div>
    <ul>
      <li class="res-item" v-for="(js, index) in allJs" :key="`js${index}`">
        <i @click="removeJs(index)" title="Remove">&times;</i>
        {{ js }}
        <input :ref="`js${js}`" type="hidden" :value="js" />
        <div class="res-item-op">
          <a @click="copy(js, 'js', $event)">Copy</a>
        </div>
      </li>
    </ul>
    <div class="res-actions">
      <h3>CSS</h3>
      <button @click="newCss" title="New CSS">+</button>
    </div>
    <ul>
      <li class="res-item" v-for="(css, index) in allCss" :key="`css${index}`">
        <i @click="removeCss(index)" title="Remove">&times;</i>
        {{ css }}
        <input :ref="`css${css}`" type="hidden" :value="css" />
        <div class="res-item-op">
          <a @click="copy(css, 'css', $event)">Copy</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "../store";

@Component({
  components: {}
})
export default class Wallet extends Vue {
  get allJs() {
    return this.$store.state.resources.js;
  }

  get allCss() {
    return this.$store.state.resources.css;
  }

  newJs() {
    var n = window.prompt("Input the url of the Javascript library:");
    if (n) {
      this.$store.dispatch("resources/addJs", n);
    }
  }

  removeJs(index: number) {
    this.$store.dispatch("resources/removeJs", index);
  }

  newCss() {
    var n = window.prompt("Input the url of the CSS library:");
    if (n) {
      this.$store.dispatch("resources/addCss", n);
    }
  }

  removeCss(index: number) {
    this.$store.dispatch("resources/removeCss", index);
  }

  copy(url: string, type: string, e: any) {
    const input = (this.$refs[`${type}${url}`] as any)[0];
    input.setAttribute("type", "text");
    input.select();
    document.execCommand("copy");
    input.setAttribute("type", "hidden");
    e.target.innerText = "Copied";
    setTimeout(() => {
      e.target.innerText = "Copy";
    }, 500);
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"
.resources
  height 100%
  overflow scroll
  .res-actions
    padding 0 0.5em
    display flex
    align-items baseline
    justify-content space-between
    h3
      margin 0
      font-size 0.9em
    button
      font-size 1.5em
      background transparent
      border 0
      box-shadow none
      color $color
      padding 0
      line-height 1.5
      cursor pointer
  ul
    margin 0
    padding 0 1em
    list-style none
    overflow scroll
  .res-item
    position relative
    width 100%
    padding 0 0 20px 20px
    margin 1em 0
    font-size 0.9em
    word-break break-all
    i
      font-style normal
      position absolute
      left 0
      cursor pointer
    .res-item-op
      position absolute
      margin-top 3px
      font-size 0.8em
      a
        display none
        color rgba($color, 0.5)
        cursor pointer
      * + a
        margin-left 1em
    &:hover
      .res-item-op
        a
          display inline
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
body.dark-theme
  ..resources
    .res-actions
      button
        color $color
    .res-item
      .res-item-op
        a
          color rgba($color, 0.5)
</style>
