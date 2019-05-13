import { ActionContext } from "vuex";

export default {
  namespaced: true,
  state: {
    site: "lity",
    darkTheme: false
  },
  mutations: {
    toggleTheme(state: any) {
      state.darkTheme = !state.darkTheme;
    },
    switchSite(state: any, site: string) {
      state.site = site;
    }
  },
  actions: {
    toggleTheme(context: ActionContext<any, any>) {
      context.commit("toggleTheme");
    },
    switchSite(context: ActionContext<any, any>, payload: string) {
      context.commit("switchSite", payload);
    }
  }
};
