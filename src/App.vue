<template>
  <div id="app" :class="theme">
    <Lity></Lity>
  </div>
</template>

<script>
import normalize from "normalize-styl";
import iconmoon from "@/components/Icomoon.vue";
import Lity from "@/views/Lity.vue";

export default {
  components: {
    Lity
  },
  computed: {
    theme() {
      return this.$store.state.darkTheme ? "dark" : "";
    }
  }
};
</script>

<style lang="stylus">
@import "./assets/themes/light.styl"

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  min-width 1440px
  height 100%
  min-height 540px
  background-color $backgroundColor
  color $color
</style>

<style lang="stylus">
@import "./assets/themes/dark.styl"
#app.dark
  background-color $backgroundColor
  color $color
</style>
