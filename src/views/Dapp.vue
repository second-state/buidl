<template>
  <div class="dapp">
    <Actions>
      <button><span class="icon-play3"></span>Run</button>
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
export default class Dapp extends Vue {}
</script>

<style lang="stylus">
.dapp
  height 100%
</style>
