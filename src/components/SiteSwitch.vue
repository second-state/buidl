<template>
  <div class="site-switch">
    <div
      class="site-wrapper"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      :class="{ hover: hover }"
    >
      <div
        class="site site-lity"
        :class="{ shown: site === 'lity' }"
        @click="switchSite('lity')"
      >
        Lity
      </div>
      <div
        class="site site-dapp"
        :class="{ shown: site === 'dapp' }"
        @click="switchSite('dapp')"
      >
        Dapp
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      hover: false
    };
  },
  computed: {
    site() {
      return this.$store.state.prefs.site;
    }
  },
  methods: {
    switchSite(site) {
      if (this.$store.state.prefs.site !== site) {
        this.hover = false;
        this.$store.dispatch("prefs/switchSite", site);
      }
    }
  }
};
</script>

<style lang="stylus">
@import "../assets/var.styl"

.site-switch
  position absolute
  overflow-y hidden

  .site-wrapper
    display inline-block
    font-family 'Baloo Bhai', Helvetica, Arial, sans-serif !important
    font-size 1.5em
    line-height $sideBarWidth
    width $sideBarWidth
    .site
      position absolute
      top - $sideBarWidth
      width 100%
      color #ffffff
      text-align center
      cursor pointer
      transition top 0.4s
      &.shown
        position relative
        top 0
        z-index 1
    &.hover
      .site
        top 0
        &.shown
          top $sideBarWidth

    .site-lity
      background-color $red
    .site-dapp
      background-color $green
</style>
