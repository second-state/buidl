<template>
  <div class="side-bar">
    <SiteSwitch />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SiteSwitch from "@/components/SiteSwitch.vue";

@Component({
  components: {
    SiteSwitch
  }
})
export default class SideBar extends Vue {
  computed() {
    return {
      site: (): string => {
        return this["$store"].state.prefs.site;
      }
    };
  }
}
</script>

<style lang="stylus">
@import "../assets/var.styl"

.side-bar
  position fixed
  top 0
  left 0
  width $sideBarWidth
  bottom 0
  background-color #454545
</style>
