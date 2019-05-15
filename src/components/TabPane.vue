<template>
  <div :class="prefixCls" v-show="show" :style="contentStyle">
    <slot></slot>
  </div>
</template>
<script>
const prefixCls = "tabs-tabpane";

export default {
  name: "TabPane",
  inject: ["TabsInstance"],
  props: {
    name: {
      type: String
    },
    label: {
      type: [String, Function],
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tab: {
      type: String
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      show: true,
      currentName: this.name
    };
  },
  computed: {
    contentStyle() {
      return {
        visibility:
          this.TabsInstance.activeKey !== this.currentName
            ? "hidden"
            : "visible"
      };
    }
  },
  methods: {
    updateNav() {
      this.TabsInstance.updateNav();
    }
  },
  watch: {
    name(val) {
      this.currentName = val;
      this.updateNav();
    },
    label() {
      this.updateNav();
    },
    disabled() {
      this.updateNav();
    }
  },
  mounted() {
    this.updateNav();
  },
  destroyed() {
    this.updateNav();
  }
};
</script>
