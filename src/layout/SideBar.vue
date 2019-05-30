<template>
  <div class="side-bar">
    <SiteSwitch />
    <button
      class="side-btn"
      :class="lityPanel === 'Deployed' ? 'side-btn-active' : ''"
      v-if="site === 'lity'"
      @click="toggleDeployedPanel"
    >
      <span class="icon-drawer2"></span>
    </button>
    <button
      class="side-btn"
      :class="lityPanel === 'Contracts' ? 'side-btn-active' : ''"
      v-if="site === 'lity'"
      @click="toggleContractsPanel"
    >
      <span class="icon-file-play"></span>
    </button>
    <button
      class="side-btn"
      :class="dappPanel === 'ContractApi' ? 'side-btn-active' : ''"
      v-else
      @click="toggleContractApiPanel"
    >
      <span class="icon-clipboard"></span>
    </button>
    <div class="bottom">
      <button
        class="side-btn"
        :class="
          (site === 'lity' && lityPanel === 'Wallet') ||
          (site === 'dapp' && dappPanel === 'Wallet')
            ? 'side-btn-active'
            : ''
        "
        @click="toggleWalletPanel"
      >
        <span class="icon-pen"></span>
      </button>
      <button
        class="side-btn web3-provider"
        :class="providerStatus"
        v-click-outside="hideNodePop"
        @click="toggleNodePop"
      >
        <span class="icon-power"></span>
        <NodePop ref="nodePop" v-show="showNodePop" />
      </button>
      <Switcher size="small" @onChange="toggleTheme" :value="dt" />
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
    let using = (this.$refs.nodePop as any).using;
    let custom = (this.$refs.nodePop as any).custom;
    if (using !== this.$store.state.prefs.web3Provider.using) {
      this.$store.dispatch("prefs/setWeb3ProviderUsing", using);
    }
    if (custom !== this.$store.state.prefs.web3Provider.custom) {
      this.$store.dispatch("prefs/setWeb3ProviderCustom", custom);
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
  padding-top $sideBarWidth
  background-color #454545
  .side-btn
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
