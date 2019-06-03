<template>
  <div class="logs" v-html="'<p>' + logs.join('</p><p>') + '</p>'"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Logs extends Vue {
  private logs: string[];

  public constructor() {
    super();
    this.logs = this.$store.state.outputs.lityLogs;
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

.logs
  color $color
p
  margin 0 0 1em
  word-break break-all
  line-height 1.4
  .error
    color red
  .success
    color green
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
body.dark-theme
  .logs
    color $color
</style>
