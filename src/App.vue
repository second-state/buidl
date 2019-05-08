<template>
  <div id="app">
    <Home></Home>
  </div>
</template>

<script>
import normalize from "normalize-styl";
import Home from "@/views/Home.vue";

export default {
  components: {
    Home
  }
};
</script>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
</style>
