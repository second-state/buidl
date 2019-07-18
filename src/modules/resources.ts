import { ActionContext } from "vuex";

export default {
  namespaced: true,
  state: {
    js: [],
    css: []
  },
  mutations: {
    addJs(state: any, js: string) {
      state.js.push(js);
    },
    removeJs(state: any, index: number) {
      state.js.splice(index, 1);
    },
    addCss(state: any, js: string) {
      state.css.push(js);
    },
    removeCss(state: any, index: number) {
      state.css.splice(index, 1);
    }
  },
  actions: {
    addJs(context: ActionContext<any, any>, payload: string) {
      context.commit("addJs", payload);
    },
    removeJs(context: ActionContext<any, any>, payload: number) {
      context.commit("removeJs", payload);
    },
    addCss(context: ActionContext<any, any>, payload: string) {
      context.commit("addCss", payload);
    },
    removeCss(context: ActionContext<any, any>, payload: number) {
      context.commit("removeCss", payload);
    }
  }
};
