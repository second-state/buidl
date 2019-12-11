import Vue from "vue";
import App from "./App.vue";
import Loading from "./components/Loading.vue";
import store from "./store";
import _ from "./lodash";
import "./registerServiceWorker";
import TutServ from "./services/tutorials";

Vue.config.productionTip = false;

const vm = new Vue({
  el: "#app",
  store,
  data: {
    loaded: false,
    tutorials: null
  },
  render: function(h) {
    if (window.localStorage) {
      try {
        let storeStr = window.localStorage.getItem("buidl");
        if (storeStr) {
          let sto = JSON.parse(storeStr);
          if (sto.prefs.darkTheme) {
            document.body.className = "dark-theme";
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (this.loaded) {
      return h(App, {
        props: {
          tutorials: this.tutorials
        }
      });
    } else {
      return h(Loading, {
        props: {
          baseSize: 32
        }
      });
    }
  }
});

function loadTutorials() {
  TutServ.getAll((c: any) => {
    if (c !== false) {
      vm.tutorials = c;
    }
    vm.loaded = true;
  });
}

const df = (document as any).fonts;
if (df) {
  try {
    _.leastDelay(
      (): Promise<any> => {
        return df.load("0 'Baloo Bhai'");
      },
      1500,
      loadTutorials
    );
  } catch (e) {
    loadTutorials();
  }
} else {
  loadTutorials();
}
