<template>
  <span :class="wrapClasses" @click="toggle" @keydown.space="toggle">
    <input type="hidden" :name="name" :value="currentValue" />
    <span :class="innerClasses">
      <slot name="open" v-if="currentValue === trueValue"></slot>
      <slot name="close" v-if="currentValue === falseValue"></slot>
    </span>
  </span>
</template>

<script>
const prefixCls = "switch";

export default {
  name: "Switcher",

  props: {
    value: {
      type: [String, Number, Boolean],
      default: false
    },
    trueValue: {
      type: [String, Number, Boolean],
      default: true
    },
    falseValue: {
      type: [String, Number, Boolean],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      validator(value) {
        return ["large", "small", "default"].indexOf(value) != -1;
      },
      default() {
        return "default";
      }
    },
    name: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-checked`]: this.currentValue === this.trueValue,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-loading`]: this.loading
        }
      ];
    },
    innerClasses() {
      return `${prefixCls}-inner`;
    }
  },
  methods: {
    toggle(event) {
      event.preventDefault();
      if (this.disabled || this.loading) {
        return false;
      }

      const checked =
        this.currentValue === this.trueValue ? this.falseValue : this.trueValue;

      this.currentValue = checked;
      this.$emit("onChange", checked);
    }
  },
  watch: {
    value(val) {
      if (val !== this.trueValue && val !== this.falseValue) {
        throw "Value should be trueValue or falseValue.";
      }
      this.currentValue = val;
    }
  }
};
</script>

<style lang="stylus">
switchCls = ".switch"
$transition-time = .2s
$ease-in-out = ease-in-out
$primary-color = #2d8cf0

{switchCls} {
  display inline-block
  width 44px
  height 22px
  line-height 20px
  border-radius 22px
  vertical-align middle
  border 1px solid #ccc
  background-color #ccc
  position relative
  cursor pointer
  user-select none
  transition all $transition-time $ease-in-out

  &-loading{
    opacity .4
  }

  &-inner {
    color #fff
    font-size 12px
    position absolute
    left 23px

    i {
      width 12px
      height 12px
      text-align center
      position relative
      top -1px
    }
  }

  &:after {
    content ""
    width 18px
    height 18px
    border-radius 18px
    background-color #fff
    position absolute
    left 1px
    top 1px
    cursor pointer
    transition left $transition-time $ease-in-out, width $transition-time $ease-in-out
  }

  &:active:after {
    width 26px
  }

  &:before{
    content ""
    display none
    width 14px
    height 14px
    border-radius 50%
    background-color transparent
    position absolute
    left 3px
    top 3px
    z-index 1
    border 1px solid $primary-color
    border-color transparent transparent transparent $primary-color
    animation switch-loading 1s linear
    animation-iteration-count infinite
  }
  &-loading:before{
    display block
  }

  &:focus {
    box-shadow 0 0 0 2px fade($primary-color, 20%)
    outline 0
  }

  &:focus:hover {
    box-shadow none
  }

  &-small {
    width 28px
    height 16px
    line-height 14px
    &:after {
      width 12px
      height 12px
    }
    &:active:after {
      width 14px
    }
    &:before{
      width 10px
      height 10px
      left 2px
      top 2px
    }
  }

  &-small&-checked:after {
    left 13px
  }
  &-small&-checked:before {
    left 14px
  }

  &-small:active&-checked:after {
    left 11px
  }

  &-large{
    width 56px
    &:active:after {
      width 26px
    }
  }

  &-large:active:after {
    width 30px
  }

  &-large&-checked:after {
    left 35px
  }
  &-large&-checked:before {
    left 37px
  }

  &-large:active&-checked:after {
    left 23px
  }

  &-checked {
    border-color $primary-color
    background-color $primary-color

    {switchCls}-inner {
      left 7px
    }

    &:after {
      left 23px
    }
    &:before{
      left 25px
    }

    &:active:after {
      left 15px
    }
  }

  &-disabled {
    cursor not-allowed
    opacity .4

    &:after {
      background #fff
      cursor not-allowed
    }

    {switchCls}-inner {
      color #fff
    }
  }

  &-disabled&-checked{
    border-color $primary-color
    background-color $primary-color
    opacity .4

    &:after {
      background #fff
    }

    {switchCls}-inner {
      color #fff
    }
  }

}

@keyframes switch-loading {
  0% {
    transform rotate(0)
  }
  100% {
    transform rotate(360deg)
  }
}
</style>
