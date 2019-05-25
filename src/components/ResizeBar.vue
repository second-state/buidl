<template>
  <div
    class="resize-bar"
    :class="resizeDirection"
    @mousedown.prevent="mousedown"
  ></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { debounce } from "lodash";

@Component({
  props: {
    resizeDirection: String
  }
})
export default class ResizeBar extends Vue {
  startPoint = 0;
  startSize = 0;
  _debouncedResize: EventListenerOrEventListenerObject | undefined = undefined;

  mousedown(e: any) {
    const element = this.$el.parentElement;
    if (!element) {
      return;
    }
    const dim = element.getBoundingClientRect();
    if (this.$props.resizeDirection === "horizontal") {
      this.startPoint = e.pageX;
      this.startSize = dim.width;
    } else if (this.$props.resizeDirection === "horizontal-left") {
      this.startPoint = e.pageX;
      this.startSize = dim.width;
    } else {
      this.startPoint = e.pageY;
      this.startSize = dim.height;
    }
    this._debouncedResize = debounce(this.resize, 0, { maxWait: 100 });
    document.body.addEventListener("mousemove", this._debouncedResize);
    document.body.addEventListener("mouseup", this.mouseup);
    document.body.className =
      document.body.className + ` ${this.$props.resizeDirection}-resizing`;
  }

  mouseup() {
    if (this._debouncedResize) {
      document.body.removeEventListener("mousemove", this._debouncedResize);
    }
    document.body.removeEventListener("mouseup", this.mouseup);
    document.body.className = document.body.className.replace(
      ` ${this.$props.resizeDirection}-resizing`,
      ""
    );
  }

  resize(e: any) {
    const element = this.$el.parentElement;
    if (this.$props.resizeDirection === "horizontal") {
      let width = this.startSize + e.pageX - this.startPoint;
      (element as any).style.width = `${width}px`;
    } else if (this.$props.resizeDirection === "horizontal-left") {
      let width = this.startSize + this.startPoint - e.pageX;
      (element as any).style.width = `${width}px`;
    } else {
      let height = this.startSize + this.startPoint - e.pageY;
      (element as any).style.height = `${height}px`;
    }
    this.$store.dispatch("events/triggerEditorResize");
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
    width 3px
    cursor col-resize
  &.horizontal-left
    left 0
    top 0
    bottom 0
    width 3px
    cursor col-resize
  &.vertical
    top 0
    left 0
    right 0
    height 3px
    cursor row-resize

body
  &.horizontal-resizing *, &.horizontal-left-resizing *
    cursor col-resize !important
  &.vertical-resizing *
    cursor row-resize !important
</style>
