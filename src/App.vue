<template>
  <div id="app">
    <SideBar />

    <Panel
      v-show="
        !usingMetaMask &&
          ((site === 'lity' && lityPanel === 'Wallet') ||
            (site === 'dapp' && dappPanel === 'Wallet'))
      "
    >
      <Wallet></Wallet>
    </Panel>
    <Panel
      v-show="site === 'lity' && lityPanel !== 'Wallet' && lityPanel !== ''"
    >
      <Deployed v-show="lityPanel === 'Deployed'"></Deployed>
      <Contracts v-show="lityPanel === 'Contracts'"></Contracts>
    </Panel>
    <Panel
      v-show="site === 'dapp' && dappPanel !== 'Wallet' && dappPanel !== ''"
    >
      <ContractApi v-show="dappPanel === 'ContractApi'"></ContractApi>
      <Resources v-show="dappPanel === 'Resources'"></Resources>
    </Panel>

    <Lity v-show="site === 'lity'"></Lity>
    <Dapp v-show="site === 'dapp'"></Dapp>
    <Tutorial
      v-if="tutorials"
      v-show="showTutorial"
      v-on:hide="showTutorial = false"
      v-on:apply="applyTutorial"
      :tutorials="tutorials"
    />
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
import Resources from "@/components/Resources.vue";
import Wallet from "@/components/Wallet.vue";
import Tutorial from "@/components/Tutorial.vue";
import TutServ from "./services/tutorials";
import { PQ } from "./utils";

let loadedTutFiles = 0;

export default {
  components: {
    Lity,
    Dapp,
    SideBar,
    Panel,
    Deployed,
    Contracts,
    ContractApi,
    Resources,
    Wallet,
    Tutorial
  },
  props: {
    tutorials: Object
  },
  data() {
    return {
      showTutorial: false
    };
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
    },
    usingMetaMask() {
      return this.$store.state.prefs.web3Provider.usingMetaMask;
    }
  },
  methods: {
    ...mapActions("prefs", ["toggleTheme"]),
    getTutorialFile(type, file) {
      TutServ.getFile(file, c => {
        if (c !== false) {
          this.$store.dispatch(`editor/set${type}`, c);
        }
        if (++loadedTutFiles === 4) {
          this.$store.dispatch("events/triggerEditorsReset");
          this.showTutorial = false;
        }
      });
    },
    applyTutorial(selectedTutorial) {
      const tutorial = this.tutorials[selectedTutorial];

      const resources = tutorial.resources;
      if (resources) {
        if (Array.isArray(resources.js)) {
          this.$store.dispatch("resources/setJs", resources.js);
        }
        if (Array.isArray(resources.css)) {
          this.$store.dispatch("resources/setCss", resources.css);
        }
      }

      ["Lity", "Html", "Css", "Js"].forEach(t => {
        const f = tutorial.files[t.toLowerCase()];
        this.getTutorialFile(t, f && `${selectedTutorial}/${f}`);
      });
    }
  },
  created() {
    if (PQ["web3_provider"]) {
      let c = {
        url: PQ["web3_provider"],
        chainId: PQ["web3_chainId"] || ""
      };
      if (PQ["gas_price"] || PQ["gas_limit"]) {
        c.customGas = true;
        c.gasPrice = PQ["gas_price"] || "";
        c.gasLimit = PQ["gas_limit"] || "";
      }
      this.$store.dispatch("prefs/setWeb3ProviderCustom", c);
      this.$store.dispatch("prefs/setWeb3ProviderUsing", "");
    }
    if (PQ["es_provider"]) {
      this.$store.dispatch("prefs/setESProviderCustom", {
        url: PQ["es_provider"]
      });
      this.$store.dispatch("prefs/setESProviderUsing", "");
    }
    if (PQ["tutorial"]) {
      this.showTutorial = true;
    }
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
