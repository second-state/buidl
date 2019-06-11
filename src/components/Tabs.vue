<template>
  <div :class="classes">
    <div :class="[prefixCls + '-bar']">
      <div :class="[prefixCls + '-nav-right']" v-if="showSlot">
        <slot name="extra"></slot>
      </div>
      <div :class="[prefixCls + '-nav-container']" tabindex="0">
        <div ref="navWrap" :class="[prefixCls + '-nav-wrap']">
          <div ref="navScroll" :class="[prefixCls + '-nav-scroll']">
            <div ref="nav" :class="[prefixCls + '-nav']" :style="navStyle">
              <div :class="barClasses" :style="barStyle"></div>
              <div
                :class="tabCls(item)"
                v-for="(item, index) in navList"
                @click="handleChange(index)"
                :key="item.label"
              >
                <Render
                  v-if="item.labelType === 'function'"
                  :render="item.label"
                >
                </Render>
                <template v-else>{{ item.label }}</template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="contentClasses" :style="contentStyle" ref="panes">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { MutationObserver, findComponentsDownward, Render } from "../utils";

const prefixCls = "tabs";
const transitionTime = 300;

const getNextTab = (list, activeKey, direction, countDisabledAlso) => {
  const currentIndex = list.findIndex(tab => tab.name === activeKey);
  const nextIndex = (currentIndex + direction + list.length) % list.length;
  const nextTab = list[nextIndex];
  if (nextTab.disabled) {
    return getNextTab(list, nextTab.name, direction, countDisabledAlso);
  } else {
    return nextTab;
  }
};

const focusFirst = (element, root) => {
  try {
    element.focus();
  } catch (err) {} // eslint-disable-line no-empty

  if (document.activeElement == element && element !== root) {
    return true;
  }

  const candidates = element.children;
  for (let candidate of candidates) {
    if (focusFirst(candidate, root)) {
      return true;
    }
  }
  return false;
};

export default {
  name: "Tabs",
  components: { Render },
  provide() {
    return { TabsInstance: this };
  },
  props: {
    value: {
      type: [String, Number]
    },
    type: {
      validator(value) {
        return ["line", "card"].indexOf(value) != -1;
      },
      default: "line"
    },
    size: {
      validator(value) {
        return ["small", "default"].indexOf(value) != -1;
      },
      default: "default"
    },
    animated: {
      type: Boolean,
      default: true
    },
    captureFocus: {
      type: Boolean,
      default: false
    },
    beforeRemove: Function,
    name: {
      type: String
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      navList: [],
      barWidth: 0,
      barOffset: 0,
      activeKey: this.value,
      focusedKey: this.value,
      showSlot: false,
      navStyle: {
        transform: ""
      },
      transitioning: false
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-card`]: this.type === "card",
          [`${prefixCls}-mini`]: this.size === "small",
          [`${prefixCls}-no-animation`]: !this.animated
        }
      ];
    },
    contentClasses() {
      return [
        `${prefixCls}-content`,
        {
          [`${prefixCls}-content-animated`]: this.animated
        }
      ];
    },
    barClasses() {
      return [
        `${prefixCls}-ink-bar`,
        {
          [`${prefixCls}-ink-bar-animated`]: this.animated
        }
      ];
    },
    contentStyle() {
      const x = this.getTabIndex(this.activeKey);
      const p = x === 0 ? "0%" : `-${x}00%`;

      let style = {};
      if (x > -1) {
        style = {
          transform: `translateX(${p}) translateZ(0px)`
        };
      }
      return style;
    },
    barStyle() {
      let style = {
        visibility: "hidden",
        width: `${this.barWidth}px`
      };
      if (this.type === "line") {
        style.visibility = "visible";
      }
      if (this.animated) {
        style.transform = `translate3d(${this.barOffset}px, 0px, 0px)`;
      } else {
        style.left = `${this.barOffset}px`;
      }

      return style;
    }
  },
  methods: {
    getTabs() {
      // return this.$children.filter(item => item.$options.name === "TabPane");
      const AllTabPanes = findComponentsDownward(this, "TabPane");
      const TabPanes = [];

      AllTabPanes.forEach(item => {
        if (item.tab && this.name) {
          if (item.tab === this.name) {
            TabPanes.push(item);
          }
        } else {
          TabPanes.push(item);
        }
      });

      TabPanes.sort((a, b) => {
        if (a.index && b.index) {
          return a.index > b.index ? 1 : -1;
        }
      });
      return TabPanes;
    },
    updateNav() {
      this.navList = [];
      this.getTabs().forEach((pane, index) => {
        this.navList.push({
          labelType: typeof pane.label,
          label: pane.label,
          name: pane.currentName || index,
          disabled: pane.disabled
        });
        if (!pane.currentName) {
          pane.currentName = index;
        }
        if (index === 0) {
          if (!this.activeKey) this.activeKey = pane.currentName || index;
        }
      });
      this.updateStatus();
      this.updateBar();
    },
    updateBar() {
      this.$nextTick(() => {
        const index = this.getTabIndex(this.activeKey);
        if (!this.$refs.nav) {
          return;
        }
        const prevTabs = this.$refs.nav.querySelectorAll(`.${prefixCls}-tab`);
        const tab = prevTabs[index];
        this.barWidth = tab ? parseFloat(tab.offsetWidth) : 0;

        if (index > 0) {
          let offset = 0;
          const gutter = this.size === "small" ? 0 : 16;
          for (let i = 0; i < index; i++) {
            offset += parseFloat(prevTabs[i].offsetWidth) + gutter;
          }

          this.barOffset = offset;
        } else {
          this.barOffset = 0;
        }
      });
    },
    updateStatus() {
      const tabs = this.getTabs();
      tabs.forEach(
        tab => (tab.show = tab.currentName === this.activeKey || this.animated)
      );
    },
    tabCls(item) {
      return [
        `${prefixCls}-tab`,
        {
          [`${prefixCls}-tab-disabled`]: item.disabled,
          [`${prefixCls}-tab-active`]: item.name === this.activeKey,
          [`${prefixCls}-tab-focused`]: item.name === this.focusedKey
        }
      ];
    },
    handleChange(index) {
      if (this.transitioning) {
        return;
      }

      this.transitioning = true;
      setTimeout(() => (this.transitioning = false), transitionTime);

      const nav = this.navList[index];
      if (nav.disabled) {
        return;
      }
      this.activeKey = nav.name;
      this.$emit("input", nav.name);
      this.$emit("onClick", nav.name);
    },
    getTabIndex(name) {
      return this.navList.findIndex(nav => nav.name === name);
    },
    isInsideHiddenElement() {
      let parentNode = this.$el.parentNode;
      while (parentNode && parentNode !== document.body) {
        if (parentNode.style && parentNode.style.display === "none") {
          return parentNode;
        }
        parentNode = parentNode.parentNode;
      }
      return false;
    },
    updateVisibility(index) {
      [...this.$refs.panes.querySelectorAll(`.${prefixCls}-tabpane`)].forEach(
        (el, i) => {
          if (index === i) {
            [...el.children]
              .filter(child => child.classList.contains(`${prefixCls}-tabpane`))
              .forEach(child => (child.style.visibility = "visible"));
            if (this.captureFocus) {
              setTimeout(() => focusFirst(el, el), transitionTime);
            }
          } else {
            setTimeout(() => {
              [...el.children]
                .filter(child =>
                  child.classList.contains(`${prefixCls}-tabpane`)
                )
                .forEach(child => (child.style.visibility = "hidden"));
            }, transitionTime);
          }
        }
      );
    }
  },
  watch: {
    value(val) {
      this.activeKey = val;
      this.focusedKey = val;
    },
    activeKey(val) {
      this.focusedKey = val;
      this.updateBar();
      this.updateStatus();

      // update visibility
      const nextIndex = Math.max(this.getTabIndex(this.focusedKey), 0);
      this.updateVisibility(nextIndex);
    }
  },
  mounted() {
    this.showSlot = this.$slots.extra !== undefined;

    const hiddenParentNode = this.isInsideHiddenElement();
    if (hiddenParentNode) {
      this.mutationObserver = new MutationObserver(() => {
        if (hiddenParentNode.style.display !== "none") {
          this.updateBar();
          this.mutationObserver.disconnect();
        }
      });

      this.mutationObserver.observe(hiddenParentNode, {
        attributes: true,
        childList: true,
        characterData: true,
        attributeFilter: ["style"]
      });
    }

    this.updateVisibility(this.getTabIndex(this.activeKey));
  },
  beforeDestroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }
};
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

tabsPrefixCls = ".tabs"
$primary-color = #656565
$darkGray = #dcdee2
$gray = #fbfbfb
$ease-in-out = ease-in-out

{tabsPrefixCls}
  box-sizing border-box
  position relative
  overflow hidden
  color $darkGray
  clearfix()

  &-bar
    outline none

  &-ink-bar
    height 1px
    box-sizing border-box
    background-color $primary-color
    position absolute
    left 0
    bottom 1px
    z-index 1
    transition transform .3s $ease-in-out
    transform-origin 0 0

  &-bar
    margin-bottom 16px

  &-nav-container
    margin-bottom -1px
    line-height 1.5
    font-size 1em
    box-sizing border-box
    white-space nowrap
    overflow hidden
    position relative
    clearfix()

  &-nav-container:focus
    outline none

  &-nav-wrap
    overflow hidden
    margin-bottom -1px

  &-nav-scroll
    overflow hidden
    white-space nowrap

  &-nav-right
    float right
    margin-left 5px

  &-nav
    padding-left 0
    margin 0
    float left
    list-style none
    box-sizing border-box
    position relative

    &:before,
    &:after
      display table
      content " "

    &:after
      clear both

    {tabsPrefixCls}-tab-disabled
      pointer-events none
      cursor default
      color #ccc

    {tabsPrefixCls}-tab
      display inline-block
      height 100%
      padding 8px 16px
      margin-right 16px
      box-sizing border-box
      cursor pointer
      text-decoration none
      position relative
      &:hover, &:active, &-active
        color $primary-color

  &-mini &-nav-container
    font-size 1em

  &-mini &-tab
    margin-right 0
    padding 8px 16px
    font-size 0.8em

  &
    {tabsPrefixCls}-content-animated
      display flex
      flex-direction row
      will-change transform
      transition transform .3s $ease-in-out

    {tabsPrefixCls}-tabpane
      flex-shrink 0
      width 100%
      transition opacity .3s
      opacity 1
      outline none

    {tabsPrefixCls}-tabpane-inactive
      opacity 0
      height 0

  // card style
  &&-card > &-bar
    border-bottom 1px solid $darkGray

  &&-card > &-bar &-nav-container
    height 32px
  &&-card&-mini > &-bar &-nav-container
    height 27px
  &&-card > &-bar &-ink-bar
    visibility hidden
  &&-card > &-bar &-tab
    margin 0
    margin-right 4px
    height 31px
    padding 5px 16px 4px
    border 1px solid $darkGray
    border-bottom 0
    border-radius 4px 4px 0 0
    background $gray
  &&-card&-mini > &-bar &-tab
    height 26px
  &&-card > &-bar &-tab-active
    height 32px
    padding-bottom 5px
    background #fff
    transform translateZ(0)
    border-color $primary-color
  &&-card&-mini > &-bar &-tab-active
    height 27px
  &&-card > &-bar &-nav-wrap
    margin-bottom 0

{tabsPrefixCls}-no-animation
  > {tabsPrefixCls}-content
    transform none!important
    > {tabsPrefixCls}-tabpane-inactive
      display none

clearfix()
  zoom 1
  &:before,
  &:after
    content ""
    display table
  &:after
    clear both
    visibility hidden
    font-size 0
    height 0
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"

tabsPrefixCls = ".tabs"
dt = "/body.dark-theme"

$primary-color = #dad9d9
$darkGray = #8d8e90
$gray = #6a6a6b

{tabsPrefixCls}
  color $darkGray
  {dt} &-ink-bar
    background-color $primary-color
  {dt} ^[0]^[0]-card > ^[0]-bar ^[0]-tab
    border-color $darkGray
    background $gray
  {dt} ^[0]^[0]-card > ^[0]-bar
    border-color $darkGray
  {dt} ^[0]^[0]-card > ^[0]-bar ^[0]-tab-active
    border-color $primary-color
  {dt} ^[0]-nav ^[0]-tab
      &:hover, &:active, &-active
        color $primary-color
</style>
