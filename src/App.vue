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
import SideBar from "@/components/SideBar.vue";

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
  position: relative;
  font-family Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  min-width 1280px
  height 100vh
  min-height 340px
  padding-left $sideBarWidth
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
