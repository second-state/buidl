import { ActionContext, Action } from "vuex";

export default {
  namespaced: true,
  state: {
    text: {
      lity: "",
      html: "",
      css: "",
      js: ""
    }
  },
  mutations: {
    setLity(state: any, content: string) {
      state.text.lity = content;
    },
    setHtml(state: any, content: string) {
      state.text.html = content;
    },
    setCss(state: any, content: string) {
      state.text.css = content;
    },
    setJs(state: any, content: string) {
      state.text.js = content;
    }
  },
  actions: {
    setLity(context: ActionContext<any, any>, payload: string) {
      context.commit("setLity", payload);
    },
    setHtml(context: ActionContext<any, any>, payload: string) {
      context.commit("setHtml", payload);
    },
    setCss(context: ActionContext<any, any>, payload: string) {
      context.commit("setCss", payload);
    },
    setJs(context: ActionContext<any, any>, payload: string) {
      context.commit("setJs", payload);
    }
  }
};
