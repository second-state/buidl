<template>
  <div>
    <div class="bg-mask"></div>
    <div class="pub-dialog">
      <h3>Enter the title of your Dapp</h3>
      <div class="field-group">
        <label>Dapp Title <em>*</em></label>
        <input type="text" maxlength="50" v-model="title" />
      </div>
      <div v-if="provider !== ''">
        <h3>
          Enter the provider info, or leave the <em>Endpoint</em> empty to let
          your Dapp can only be used with <em>{{ provider }}</em>
          .
        </h3>
        <div class="field-group">
          <label>Endpoint</label>
          <input type="text" placeholder="URL of the RPC node" v-model="url" />
        </div>
        <div class="field-group">
          <label>Chain Id</label>
          <input type="text" v-model="chainId" />
        </div>
        <div class="field-group">
          <label>Gas Price</label>
          <input
            type="text"
            placeholder="Default gas price (in Wei)"
            v-model="gasPrice"
          />
        </div>
        <div class="field-group">
          <label>Gas Limit</label>
          <input
            type="text"
            placeholder="Default gas limit"
            v-model="gasLimit"
          />
        </div>
      </div>

      <div class="buttons">
        <button class="cancel" @click="cancel">Cancel</button>
        <button
          class="confirm"
          @click="publish"
          :disabled="title.trim() === ''"
        >
          Publish
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {},
  props: {
    provider: String
  }
})
export default class PubDialog extends Vue {
  private provider: string | undefined;

  public title = "";
  public url = "";
  public chainId = "";
  public gasPrice = "";
  public gasLimit = "";

  cancel() {
    this.$emit("hide");
  }

  publish() {
    this.$emit("publish");
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
.pub-dialog
  position absolute
  top 0
  background-color $backgroundColor
  z-index 101
  width 500px
  padding 2rem
  left 50%
  margin-left -250px
  em
    color $red
    font-style normal
  h3
    font-size 1.1rem
    margin: 0.5rem 0
  .field-group
    padding 1rem 0
    label
      float left
      width 20%
    input
      width 80%
  .buttons
    display flex
    justify-content flex-end
    button
      margin-left 1rem
      &.cancel
        color lighten($color, 30)
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
body.dark-theme
  .bg-mask
    background-color rgba($color, 0.3)
  .pub-dialog
    background-color $backgroundColor
    .buttons
      button
        &.cancel
          color darken($color, 30)
</style>
