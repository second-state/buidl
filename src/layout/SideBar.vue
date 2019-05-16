<template>
  <div class="side-bar">
    <SiteSwitch />
    <button
      class="side-btn"
      :class="lityPanel !== '' ? 'side-btn-active' : ''"
      v-if="site === 'lity'"
      @click="toggleDeployedPanel"
    >
      <span class="icon-drawer2"></span>
    </button>
    <button
      class="side-btn"
      :class="dappPanel !== '' ? 'side-btn-active' : ''"
      v-else
      @click="toggleContractApiPanel"
    >
      <span class="icon-clipboard"></span>
    </button>
    <div class="bottom">
      <button class="side-btn">
        <span class="icon-pen"></span>
      </button>
      <button class="side-btn">
        <span class="icon-power"></span>
      </button>
      <Switcher size="small" @onChange="toggleTheme" :value="dt" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SiteSwitch from "@/components/SiteSwitch.vue";
import Switcher from "@/components/Switch.vue";

@Component({
  components: {
    SiteSwitch,
    Switcher
  }
})
export default class SideBar extends Vue {
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

  toggleTheme(): void {
    this.$store.dispatch("prefs/toggleTheme");
  }

  toggleDeployedPanel(): void {
    if (this.$store.state.events.lityPanel === "") {
      this.$store.dispatch("events/setLityPanel", "Deployed");
    } else {
      this.$store.dispatch("events/setLityPanel", "");
    }
    this.$store.dispatch("events/triggerEditorResize");
  }

  toggleContractApiPanel(): void {
    if (this.$store.state.events.dappPanel === "") {
      this.$store.dispatch("events/setDappPanel", "ContractApi");
    } else {
      this.$store.dispatch("events/setDappPanel", "");
    }
    this.$store.dispatch("events/triggerEditorResize");
  }
}
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
    font-size 1.5em
    height $sideBarWidth
    cursor pointer
    color #aaaaaa
    &:hover, &-active
      color $color
  .bottom
    position absolute
    bottom 0
    width 100%
    display flex
    flex-direction column
    align-items center

    .switch
      margin 1em 0
</style>
