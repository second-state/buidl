import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "./registerServiceWorker";

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  render: h => {
    return h(App);
  }
});
