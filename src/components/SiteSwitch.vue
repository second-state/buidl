<template>
  <div class="site-switch">
    <h1>Buidl</h1>
    For
    <div class="site-wrapper">
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
  computed: {
    site() {
      return this.$store.state.prefs.site;
    }
  },
  methods: {
    switchSite(site) {
      if (this.$store.state.prefs.site !== site) {
        this.$store.dispatch("prefs/switchSite", site);
      }
    }
  }
};
</script>

<style lang="stylus">
@import "../assets/var.styl"

$labelHeight = 50px

.site-switch
  position absolute
  padding 0 1em
  z-index 99

  h1
    display inline-block
    margin 0
    font-size 2em

  .site-wrapper
    display inline-block
    font-family 'Baloo Bhai', Helvetica, Arial, sans-serif !important
    font-size 2em
    line-height $labelHeight
    .site
      position absolute
      top - $labelHeight
      padding 0 0.5em
      color #ffffff
      width: 80px;
      text-align center
      cursor pointer
      transition top 0.4s
      &.shown
        position relative
        top 0
        z-index 1
    &:hover
      .site
        top 0
        &.shown
          top $labelHeight

    .site-lity
      background-color $red
    .site-dapp
      background-color $green
</style>
