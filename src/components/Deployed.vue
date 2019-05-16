<template>
  <div class="deployed-contracts"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Deployed extends Vue {
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
