<template>
  <div id="app">
    <SideBar />

    <Panel
      v-if="
        (site === 'lity' && lityPanel === 'Wallet') ||
          (site === 'dapp' && dappPanel === 'Wallet')
      "
    >
      <Wallet></Wallet>
    </Panel>
    <Panel v-else-if="site === 'lity' && lityPanel !== ''">
      <Deployed v-if="lityPanel === 'Deployed'"></Deployed>
      <Contracts v-if="lityPanel === 'Contracts'"></Contracts>
    </Panel>
    <Panel v-else-if="site === 'dapp' && dappPanel !== ''">
      <ContractApi v-if="dappPanel === 'ContractApi'"></ContractApi>
    </Panel>

    <Lity v-show="site === 'lity'"></Lity>
    <Dapp v-show="site === 'dapp'"></Dapp>
  </div>
</template>

<script>
import normalize from "normalize-styl";
import general from "@/assets/general.styl";
import { mapActions } from "vuex";
import iconmoon from "@/components/Icomoon.vue";
import Lity from "@/views/Lity.vue";
import Dapp from "@/views/Dapp.vue";
import SideBar from "@/layout/SideBar.vue";
import Panel from "@/layout/Panel.vue";
import Deployed from "@/components/Deployed.vue";
import Contracts from "@/components/Contracts.vue";
import ContractApi from "@/components/ContractApi.vue";
import Wallet from "@/components/Wallet.vue";

export default {
  components: {
    Lity,
    Dapp,
    SideBar,
    Panel,
    Deployed,
    Contracts,
    ContractApi,
    Wallet
  },
  computed: {
    site() {
      return this.$store.state.prefs.site;
    },
    lityPanel() {
      return this.$store.state.events.lityPanel;
    },
    dappPanel() {
      return this.$store.state.events.dappPanel;
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
    outline none
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
