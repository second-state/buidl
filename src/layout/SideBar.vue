<template>
  <div class="side-bar">
    <SiteSwitch />
    <button
      class="side-btn"
      :class="lityPanel === 'Deployed' ? 'side-btn-active' : ''"
      v-if="site === 'lity'"
      @click="toggleDeployedPanel"
      title="Deployed Contracts"
      onClick="gtag('event', 'contract', {'event_category': 'deployed'});"
    >
      <span :class="deployedContracts > 0 ? 'icon-drawer' : 'icon-drawer2'">
      </span>
      <label>Deployed</label>
    </button>
    <button
      class="side-btn"
      :class="lityPanel === 'Contracts' ? 'side-btn-active' : ''"
      v-if="site === 'lity'"
      @click="toggleContractsPanel"
      title="Compiled Contracts"
      onClick="gtag('event', 'contract', {'event_category': 'compiled'});"
    >
      <span class="icon-file-play"></span>
      <label>Compiled</label>
    </button>
    <button
      class="side-btn"
      :class="dappPanel === 'Resources' ? 'side-btn-active' : ''"
      v-if="site === 'dapp'"
      @click="toggleResourcesPanel"
      title="Manage 3rd Party Resources"
      onClick="gtag('event', 'dapp', {'event_category': 'resources'});"
    >
      <span class="icon-magic-wand"></span>
      <label>Resources</label>
    </button>
    <button
      class="side-btn"
      :class="dappPanel === 'ContractApi' ? 'side-btn-active' : ''"
      v-if="site === 'dapp'"
      @click="toggleContractApiPanel"
      title="Deployed Contracts"
      onClick="gtag('event', 'dapp', {'event_category': 'deployed'});"
    >
      <span class="icon-clipboard"></span>
      <label>Deployed</label>
    </button>
    <div class="bottom">
      <button
        v-if="!usingMetaMask"
        class="side-btn"
        :class="
          (site === 'lity' && lityPanel === 'Wallet') ||
          (site === 'dapp' && dappPanel === 'Wallet')
            ? 'side-btn-active'
            : ''
        "
        @click="toggleWalletPanel"
        title="Manage Accounts"
        onClick="gtag('event', 'sys', {'event_category': 'accounts'});"
      >
        <span class="icon-pen"></span>
        <label>Accounts</label>
      </button>
      <button
        class="side-btn web3-provider"
        :class="providerStatus"
        v-click-outside="hideNodePop"
        @click="toggleNodePop"
        onClick="gtag('event', 'sys', {'event_category': 'providers'});"
      >
        <span :class="`icon-${providerChain}`" title="Manage Providers">
          <!-- eslint-disable-next-line -->
          <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span><span class="path22"></span><span class="path23"></span><span class="path24"></span><span class="path25"></span><span class="path26"></span><span class="path27"></span><span class="path28"></span><span class="path29"></span><span class="path30"></span><span class="path31"></span><span class="path32"></span><span class="path33"></span><span class="path34"></span><span class="path35"></span><span class="path36"></span><span class="path37"></span><span class="path38"></span><span class="path39"></span><span class="path40"></span><span class="path41"></span><span class="path42"></span><span class="path43"></span><span class="path44"></span><span class="path45"></span><span class="path46"></span><span class="path47"></span><span class="path48"></span><span class="path49"></span><span class="path50"></span><span class="path51"></span><span class="path52"></span><span class="path53"></span><span class="path54"></span><span class="path55"></span><span class="path56"></span><span class="path57"></span><span class="path58"></span><span class="path59"></span><span class="path60"></span><span class="path61"></span><span class="path62"></span><span class="path63"></span><span class="path64"></span><span class="path65"></span><span class="path66"></span><span class="path67"></span><span class="path68"></span><span class="path69"></span>
        </span>
        <label>Providers</label>
        <NodePop ref="nodePop" v-show="showNodePop" />
      </button>
      <Switcher size="small" @onChange="toggleTheme" :value="dt" />
      <button
        v-if="updateAvail"
        class="side-btn update-avail"
        @click="refreshToUpdate"
      >
        <span class="icon-arrow-up" title="Click to update"></span>
        <label>Upd Avail</label>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { web3 } from "@/services/web3";
import { Component, Vue } from "vue-property-decorator";
import SiteSwitch from "@/components/SiteSwitch.vue";
import Switcher from "@/components/Switch.vue";
import NodePop from "@/components/NodePop.vue";

@Component({
  components: {
    SiteSwitch,
    Switcher,
    NodePop
  }
})
export default class SideBar extends Vue {
  showNodePop = false;

  created() {
    let unwatch = this.$store.watch(
      () => {
        return this.$store.state.prefs.web3Provider.metamaskPrompt;
      },
      () => {
        this.showNodePop = true;
        unwatch();
      }
    );
  }

  get updateAvail(): boolean {
    return this.$store.state.prefs.updateAvail !== null;
  }

  get usingMetaMask(): boolean {
    return this.$store.state.prefs.web3Provider.usingMetaMask;
  }

  get dt(): string {
    return this.$store.state.prefs.darkTheme;
  }
  get site(): string {
    return this.$store.state.prefs.site;
  }
  get lityPanel(): string {
    return this.$store.state.events.lityPanel;
  }
  get dappPanel(): string {
    return this.$store.state.events.dappPanel;
  }
  get providerStatus(): string {
    return this.$store.state.prefs.web3Provider.status;
  }

  get deployedContracts(): number {
    return this.$store.state.deployed.contracts.length;
  }

  get providerChain(): string {
    const provider = this.$store.state.prefs.web3Provider;
    if (provider.using === "") {
      const chainId = provider.custom.chainId;
      switch (chainId) {
        case "1":
        case "3":
        case "4":
        case "42":
          return "eth";
        case "61":
        case "62":
          return "etc";
        case "18":
        case "19":
          return "cmt";
      }
    } else if (this.$store.state.prefs.web3Provider.usingMetaMask) {
      const web3 = (window as any).web3;
      return web3.eth ? "metamask" : "venus";
    }
    return "power";
  }

  toggleTheme(): void {
    this.$store.dispatch("prefs/toggleTheme");
  }

  toggleDeployedPanel(): void {
    if (this.$store.state.events.lityPanel === "Deployed") {
      this.$store.dispatch("events/setLityPanel", "");
    } else {
      this.$store.dispatch("events/setLityPanel", "Deployed");
    }
    this.$store.dispatch("events/triggerEditorResize");
  }

  toggleContractsPanel(): void {
    if (this.$store.state.events.lityPanel === "Contracts") {
      this.$store.dispatch("events/setLityPanel", "");
    } else {
      this.$store.dispatch("events/setLityPanel", "Contracts");
    }
    this.$store.dispatch("events/triggerEditorResize");
  }

  toggleContractApiPanel(): void {
    if (this.$store.state.events.dappPanel === "ContractApi") {
      this.$store.dispatch("events/setDappPanel", "");
    } else {
      this.$store.dispatch("events/setDappPanel", "ContractApi");
    }
    this.$store.dispatch("events/triggerEditorResize");
  }

  toggleResourcesPanel(): void {
    if (this.$store.state.events.dappPanel === "Resources") {
      this.$store.dispatch("events/setDappPanel", "");
    } else {
      this.$store.dispatch("events/setDappPanel", "Resources");
    }
    this.$store.dispatch("events/triggerEditorResize");
  }

  toggleWalletPanel(): void {
    if (this.$store.state.prefs.site === "lity") {
      if (this.$store.state.events.lityPanel === "Wallet") {
        this.$store.dispatch("events/setLityPanel", "");
      } else {
        this.$store.dispatch("events/setLityPanel", "Wallet");
      }
    } else {
      if (this.$store.state.events.dappPanel === "Wallet") {
        this.$store.dispatch("events/setDappPanel", "");
      } else {
        this.$store.dispatch("events/setDappPanel", "Wallet");
      }
    }
    this.$store.dispatch("events/triggerEditorResize");
  }

  hideNodePop(): void {
    if (!this.showNodePop) {
      return;
    }
    this.showNodePop = false;
    const customUrl = (this.$refs.nodePop as any).customUrl;
    const customChainId = (this.$refs.nodePop as any).customChainId;
    const customGas = (this.$refs.nodePop as any).customGas;
    let customGasPrice = (this.$refs.nodePop as any).customGasPrice;
    if (!/^\d+$/g.test(customGasPrice) || customGasPrice.length > 15) {
      customGasPrice = this.$store.state.prefs.web3Provider.default.gasPrice;
      (this.$refs.nodePop as any).customGasPrice = customGasPrice;
    }
    let customGasLimit = (this.$refs.nodePop as any).customGasLimit;
    if (!/^\d+$/g.test(customGasLimit) || customGasLimit.length > 10) {
      customGasLimit = this.$store.state.prefs.web3Provider.default.gasLimit;
    }
    this.$store.dispatch("prefs/setWeb3ProviderCustom", {
      url: customUrl,
      chainId: customChainId,
      customGas: customGas,
      gasPrice: customGasPrice,
      gasLimit: customGasLimit
    });

    const esUsing = (this.$refs.nodePop as any).esUsing;
    if (esUsing !== this.$store.state.prefs.esProvider.using) {
      this.$store.dispatch("prefs/setESProviderUsing", esUsing);
    }
    const esCustomUrl = (this.$refs.nodePop as any).esCustomUrl;
    if (esCustomUrl !== this.$store.state.prefs.esProvider.customUrl) {
      this.$store.dispatch("prefs/setESProviderCustom", {
        url: esCustomUrl
      });
    }

    if (this.$store.state.prefs.web3Provider.metamaskPrompt) {
      this.$store.dispatch("prefs/promptMetaMask", false);
    }
  }

  toggleNodePop(e: any): void {
    if (this.showNodePop) {
      if (!(this.$refs.nodePop as any).$el.contains(e.target)) {
        this.hideNodePop();
      }
    } else {
      this.showNodePop = true;
    }
  }

  refreshToUpdate() {
    this.$store.state.prefs.updateAvail.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  }
}

Vue.directive("click-outside", {
  bind: function(el, binding, vnode) {
    (el as any).clickOutsideEvent = function(event: any) {
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        (vnode as any).context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", (el as any).clickOutsideEvent);
  },
  unbind: function(el) {
    document.body.removeEventListener("click", (el as any).clickOutsideEvent);
  }
});
</script>

<style lang="stylus">
@import "../assets/var.styl"
@import "../assets/themes/dark.styl"

.side-bar
  position relative
  display flex
  flex-direction column
  min-width $sideBarWidth
  padding-top $sideBarWidth * 2
  background-color #454545
  .side-btn
    position relative
    background-color transparent
    border 0
    box-shadow none
    font-size 1.5em
    height $sideBarWidth
    cursor pointer
    color #aaaaaa
    &:hover, &-active
      color $color
    &.web3-provider
      &.pending
        color #ffa500
      &.accessible
        color #008000
      &.unreachable
        color #f00
    label
      font-size 0.6rem
      display block
      position absolute
      width 100%
      text-align center
      left 0
  .bottom
    position absolute
    bottom 0
    width 100%
    display flex
    flex-direction column

    .switch
      margin 1em 0
      align-self center
</style>
