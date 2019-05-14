import { ActionContext } from "vuex";
import * as monaco from "monaco-editor";

export default {
  namespaced: true,
  state: {
    site: "lity",
    darkTheme: false
  },
  mutations: {
    toggleTheme(state: any) {
      state.darkTheme = !state.darkTheme;
      window.document.body.className = state.darkTheme ? "dark-theme" : "";
      monaco.editor.setTheme(state.darkTheme ? "vs-dark" : "");
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
