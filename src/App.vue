<template>
  <div id="app">
    <SideBar />
    <Lity v-if="site === 'lity'"></Lity>
    <Dapp v-else></Dapp>
  </div>
</template>

<script>
import normalize from "normalize-styl";
import { mapActions } from "vuex";
import iconmoon from "@/components/Icomoon.vue";
import Lity from "@/views/Lity.vue";
import Dapp from "@/views/Dapp.vue";
import SideBar from "@/layout/SideBar.vue";

export default {
  components: {
    Lity,
    Dapp,
    SideBar
  },
  computed: {
    site() {
      return this.$store.state.prefs.site;
    }
  },
  methods: {
    ...mapActions("prefs", ["toggleTheme"])
  }
};
</script>

<style lang="stylus">
@import "./assets/themes/light.styl"
@import "./assets/var.styl"

#app
  position relative
  display flex
  align-items stretch
  font-family Helvetica, Arial, sans-serif
  font-size 16px
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  min-width 1280px
  height 100vh
  min-height 540px
  &, *
    box-sizing border-box
body
  background-color $backgroundColor
  color $color
  button
    color $color
</style>

<style lang="stylus">
@import "./assets/themes/dark.styl"

body.dark-theme
  background-color $backgroundColor
  color $color
  button
    color $color
</style>
