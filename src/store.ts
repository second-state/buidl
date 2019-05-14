import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import Prefs from "@/modules/prefs";
import Events from "@/modules/events";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: "buidl",
      paths: ["prefs.darkTheme", "prefs.site"]
    })
  ],
  modules: {
    events: Events,
    prefs: Prefs
  }
});
