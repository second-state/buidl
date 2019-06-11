<template>
  <div
    ref="cnsl"
    class="cnsl"
    v-html="'<p>' + cnsl.join('</p><p>') + '</p>'"
  ></div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Cnsl extends Vue {
  private cnsl: string[] | undefined;

  public constructor() {
    super();
    this.cnsl = this.$store.state.outputs.cnsl;
  }

  @Watch("cnsl")
  scrollToBottom() {
    this.$nextTick().then(() => {
      const elem = this.$refs.cnsl as any;
      elem.scrollIntoView(false);
    });
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

.cnsl
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
  .cnsl
    color $color
</style>
