<template>
  <div class="wallet"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Wallet extends Vue {
  public constructor() {
    super();
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
</style>
