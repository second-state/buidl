<template>
  <div class="site-switch">
    <div class="site-wrapper">
      <div
        class="site site-lity"
        :class="{ shown: site === 'lity' }"
        @click="switchSite('lity')"
      >
        C<sub>contract</sub>
      </div>
      <div
        class="site site-dapp"
        :class="{ shown: site === 'dapp' }"
        @click="switchSite('dapp')"
      >
        D<sub>dapp</sub>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
        this.$store.dispatch("events/triggerEditorResize");
      }
    }
  }
};
</script>

<style lang="stylus">
@import "../assets/var.styl"

.site-switch
  position absolute
  top 0

  .site-wrapper
    display inline-block
    font-family 'Baloo Bhai', Helvetica, Arial, sans-serif !important
    font-size 1.7em
    height $sideBarWidth
    width $sideBarWidth
    .site
      position absolute
      top $sideBarWidth
      width 100%
      height $sideBarWidth
      color rgba(#ffffff, 0.4)
      text-align center
      cursor pointer
      transition all 0.2s
      &.shown
        color #ffffff
        position relative
        top 0
        z-index 1
      &:hover
        color #ffffff
      sub
        display block
        font-size 0.5em

    .site-lity
      background-color rgba($red, 0.4)
      &.shown, &:hover
        background-color $red
    .site-dapp
      background-color rgba($green, 0.4)
      &.shown, &:hover
        background-color $green
</style>
