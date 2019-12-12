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
    setJs(state: any, js: Array<String>) {
      state.js = js;
    },
    addCss(state: any, js: string) {
      state.css.push(js);
    },
    removeCss(state: any, index: number) {
      state.css.splice(index, 1);
    },
    setCss(state: any, css: Array<String>) {
      state.css = css;
    }
  },
  actions: {
    addJs(context: ActionContext<any, any>, payload: string) {
      context.commit("addJs", payload);
    },
    removeJs(context: ActionContext<any, any>, payload: number) {
      context.commit("removeJs", payload);
    },
    setJs(context: ActionContext<any, any>, payload: Array<String>) {
      context.commit("setJs", payload);
    },
    addCss(context: ActionContext<any, any>, payload: string) {
      context.commit("addCss", payload);
    },
    removeCss(context: ActionContext<any, any>, payload: number) {
      context.commit("removeCss", payload);
    },
    setCss(context: ActionContext<any, any>, payload: Array<String>) {
      context.commit("setCss", payload);
    }
  }
};
