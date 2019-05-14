import { ActionContext } from "vuex";

export default {
  namespaced: true,
  state: {
    resizeEditor: false
  },
  mutations: {
    triggerEditorResize(state: any) {
      state.resizeEditor = !state.resizeEditor;
    }
  },
  actions: {
    triggerEditorResize(context: ActionContext<any, any>) {
      context.commit("triggerEditorResize");
    }
  }
};
