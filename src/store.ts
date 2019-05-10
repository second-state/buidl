import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import Prefs from "@/modules/prefs";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: "buidl",
      paths: ["prefs.darkTheme"]
    })
  ],
  modules: {
    prefs: Prefs
  }
});
