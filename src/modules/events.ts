import { ActionContext } from "vuex";

export default {
  namespaced: true,
  state: {
    resizeEditor: false,
    lityPanel: "",
    dappPanel: ""
  },
  mutations: {
    triggerEditorResize(state: any) {
      state.resizeEditor = !state.resizeEditor;
    },
    setLityPanel(state: any, content: string) {
      state.lityPanel = content;
    },
    setDappPanel(state: any, content: string) {
      state.dappPanel = content;
    }
  },
  actions: {
    triggerEditorResize(context: ActionContext<any, any>) {
      context.commit("triggerEditorResize");
    },
    setLityPanel(context: ActionContext<any, any>, payload: string) {
      context.commit("setLityPanel", payload);
    },
    setDappPanel(context: ActionContext<any, any>, payload: string) {
      context.commit("setDappPanel", payload);
    }
  }
};
