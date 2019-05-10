import { ActionContext } from "vuex";

export default {
  namespaced: true,
  state: {
    darkTheme: false
  },
  mutations: {
    toggleTheme(state: any) {
      state.darkTheme = !state.darkTheme;
    }
  },
  actions: {
    toggleTheme(context: ActionContext<any, any>) {
      context.commit("toggleTheme");
    }
  }
};
