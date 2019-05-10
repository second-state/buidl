<template>
  <div id="app" :class="theme">
    <SiteSwitch />
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
import SiteSwitch from "@/components/SiteSwitch.vue";

export default {
  components: {
    Lity,
    Dapp,
    SiteSwitch
  },
  computed: {
    theme() {
      return this.$store.state.prefs.darkTheme ? "dark" : "";
    },
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

#app
  position: relative;
  font-family Helvetica, Arial, sans-serif
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
