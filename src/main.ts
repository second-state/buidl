import Vue from "vue";
import App from "./App.vue";
import Loading from "./components/Loading.vue";
import store from "./store";
import _ from "./lodash";
import "./registerServiceWorker";

Vue.config.productionTip = false;

const vm = new Vue({
  el: "#app",
  store,
  data: {
    loaded: false
  },
  render: function(h) {
    if (this.loaded) {
      return h(App);
    } else {
      return h(Loading, {
        props: {
          baseSize: 32
        }
      });
    }
  },
  beforeCreate() {
    if (localStorage.getItem("store")) {
      store.replaceState(
        Object.assign(
          store.state,
          JSON.parse(localStorage.getItem("store") as string)
        )
      );
    }
  }
});

const df = (document as any).fonts;
if (df) {
  try {
    _.leastDelay(
      (): Promise<any> => {
        return df.load("0 'Baloo Bhai'");
      },
      1500,
      () => (vm.loaded = true)
    );
  } catch (e) {
    vm.loaded = true;
  }
} else {
  vm.loaded = true;
}
