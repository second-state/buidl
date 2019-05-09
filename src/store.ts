import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    darkTheme: false
  },
  mutations: {
    toggleTheme(state) {
      state.darkTheme = !state.darkTheme;
    }
  },
  actions: {
    toggleTheme(context) {
      context.commit("toggleTheme");
    }
  }
});
