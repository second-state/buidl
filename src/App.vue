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
  data() {
    return {
      showTutorial: true,
      tutorials: [
        {
          name: "Simple Storage",
          intro: "A simple contract to demostrate how data is set and get.",
          editors: {
            lity: `pragma solidity >=0.4.0 <0.6.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}
`,
            html: `<button id="s">Set Data</button>
<button id="g">Get Data</button>`,

            css: `button {
  background-color: #000;
  color: #fff;
  border: 0;
  font-size: 1em;
}`,

            js: `/* Don't modify */
var abi = [];
var bytecode = '';
var cAddr = '';
/* Don't modify */

var instance = null;
window.addEventListener('web3Ready', function() {
  var contract = web3.ss.contract(abi);
  instance = contract.at(cAddr);
});

// esss.shaAbi(JSON.stringify(abi)).then((shaResult) => {
//   var sha = JSON.parse(shaResult).abiSha3;
//   esss.searchUsingAbi(sha).then((searchResult) => {
//     console.log(searchResult);
//   });
// });

document.querySelector("#s").addEventListener("click", function() {
  var n = window.prompt("Enter the number:");
  n && instance.set(n);
});
document.querySelector("#g").addEventListener("click", function() {
  instance.get(function(e,d) {
    console.log(d.toString());
    alert(d.toString());
  });
});`
          }
        }
      ]
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
    applyTutorial(selectedTutorial) {
      this.showTutorial = false;
      const tutorial = this.tutorials[selectedTutorial];
      this.$store.dispatch("editor/setLity", tutorial.editors.lity);
      this.$store.dispatch("editor/setHtml", tutorial.editors.html);
      this.$store.dispatch("editor/setCss", tutorial.editors.css);
      this.$store.dispatch("editor/setJs", tutorial.editors.js);
      this.$store.dispatch("events/triggerEditorsReset");
    }
  },
  created() {
    /*
      config provider via url search
    */
    const s = window.location.search;
    if (s && s.indexOf("?") == 0) {
      let q = new Object();
      const qs = s.substring(1).split("&");
      for (let i = 0; i < qs.length; i++) {
        const qss = qs[i].split("=");
        if (qss.length === 2) {
          q[qss[0]] = qss[1] && decodeURIComponent(qss[1]);
        }
      }
      if (q["web3_provider"]) {
        let c = {
          url: q["web3_provider"],
          chainId: q["web3_chainId"] || ""
        };
        if (q["gas_price"] || q["gas_limit"]) {
          c.customGas = true;
          c.gasPrice = q["gas_price"] || "";
          c.gasLimit = q["gas_limit"] || "";
        }
        this.$store.dispatch("prefs/setWeb3ProviderCustom", c);
        this.$store.dispatch("prefs/setWeb3ProviderUsing", "");
      }
      if (q["es_provider"]) {
        this.$store.dispatch("prefs/setESProviderCustom", {
          url: q["es_provider"]
        });
        this.$store.dispatch("prefs/setESProviderUsing", "");
      }
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
