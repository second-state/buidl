<template>
  <div class="site-switch">
    <h1>Buidl</h1>
    For
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

$labelHeight = 59px

.site-switch
  position absolute
  z-index 99
  left 10px
  overflow-y hidden

  h1
    display inline
    margin 0
    font-size 1.5em

  .site-wrapper
    display inline-block
    font-family 'Baloo Bhai', Helvetica, Arial, sans-serif !important
    font-size 1.5em
    line-height $labelHeight
    .site
      position absolute
      top - $labelHeight
      padding 0 0.5em
      color #ffffff
      width: 60px;
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
          top $labelHeight

    .site-lity
      background-color $red
    .site-dapp
      background-color $green
</style>
