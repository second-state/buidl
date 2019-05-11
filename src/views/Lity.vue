<template>
  <div class="lity">
    <Actions>
      <button><span class="icon-wrench"></span>Compile</button>
      <button><span class="icon-cogs"></span>Deploy</button>
    </Actions>
    <Operating></Operating>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Actions from "@/components/Actions.vue";
import Operating from "@/components/Operating.vue";

@Component({
  components: {
    Operating,
    Actions
  }
})
export default class Lity extends Vue {}
</script>

<style lang="stylus">
.lity
  height 100%
</style>
