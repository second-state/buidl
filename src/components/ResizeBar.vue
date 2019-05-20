<template>
  <div
    class="resize-bar"
    :class="resizeDirection"
    @mousedown.prevent="mousedown"
  ></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  props: {
    resizeDirection: String
  }
})
export default class ResizeBar extends Vue {
  startPoint = 0;
  startSize = 0;

  mousedown(e: any) {
    const element = this.$parent.$el;
    const dim = element.getBoundingClientRect();
    if (this.$props.resizeDirection === "horizontal") {
      this.startPoint = e.pageX;
      this.startSize = dim.width;
    } else {
      this.startPoint = e.pageY;
      this.startSize = dim.height;
    }
    document.body.addEventListener("mousemove", this.mousemove);
    document.body.addEventListener("mouseup", this.mouseup);
  }

  mouseup() {
    document.body.removeEventListener("mousemove", this.mousemove);
    document.body.removeEventListener("mouseup", this.mouseup);
  }

  mousemove(e: any) {
    const element = this.$parent.$el;
    if (this.$props.resizeDirection === "horizontal") {
      let width = this.startSize + e.pageX - this.startPoint;
      element.setAttribute("style", `width:${width}px`);
    } else {
      let height = this.startSize + this.startPoint - e.pageY;
      element.setAttribute("style", `height:${height}px`);
    }
  }
}
</script>

<style lang="stylus">
.resize-bar
  position absolute
  z-index 1
  &.horizontal
    right 0
    top 0
    bottom 0
    width 2px
    cursor col-resize
  &.vertical
    top 0
    left 0
    right 0
    height 2px
    cursor row-resize
</style>
