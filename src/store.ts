import Vue from "vue";
import Vuex from "vuex";
import { LocalStoragePlugin } from "./plugins";
import Prefs from "./modules/prefs";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [LocalStoragePlugin],
  modules: {
    prefs: Prefs
  }
});
