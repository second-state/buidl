<template>
  <div class="operating">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Operating extends Vue {}
</script>

<style lang="stylus">
.operating
  height 100%
  flex-grow 1
  display flex
  flex-direction column
</style>
