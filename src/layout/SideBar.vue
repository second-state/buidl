<template>
  <div class="side-bar">
    <SiteSwitch />
    <div class="bottom">
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
  get dt() {
    return this.$store.state.prefs.darkTheme;
  }

  computed() {
    return {
      site: (): string => {
        return this["$store"].state.prefs.site;
      }
    };
  }

  toggleTheme(): void {
    this.$store.dispatch("prefs/toggleTheme");
  }
}
</script>

<style lang="stylus">
@import "../assets/var.styl"

.side-bar
  position relative
  width $sideBarWidth
  background-color #454545
.bottom
  position absolute
  bottom 0
  width 100%
  display flex
  justify-content center

  .switch
    margin 1em 0
</style>
