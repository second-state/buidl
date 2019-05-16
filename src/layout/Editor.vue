<template>
  <div class="editor">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Editor extends Vue {}
</script>

<style lang="stylus">
@import "../assets/var.styl"

.editor
  position relative
  flex-grow 1
</style>
