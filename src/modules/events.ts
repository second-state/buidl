import { ActionContext, Action } from "vuex";
import { DeployedContract } from "./deployed";

export default {
  namespaced: true,
  state: {
    resizeEditor: false,
    lityPanel: "",
    dappPanel: "",
    compilerReady: false,
    lityOutputTab: "problems",
    dappOutputTab: "console",
    usingDeployedContract: undefined
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
    },
    compilerReady(state: any) {
      state.compilerReady = true;
    },
    setLityOutputTab(state: any, content: string) {
      state.lityOutputTab = content;
    },
    setDappOutputTab(state: any, content: string) {
      state.dappOutputTab = content;
    },
    setUsingDeployedContract(state: any, content: DeployedContract) {
      state.usingDeployedContract = content;
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
    },
    compilerReady(context: ActionContext<any, any>) {
      context.commit("compilerReady");
    },
    setLityOutputTab(context: ActionContext<any, any>, payload: string) {
      context.commit("setLityOutputTab", payload);
    },
    setDappOutputTab(context: ActionContext<any, any>, payload: string) {
      context.commit("setDappOutputTab", payload);
    },
    setUsingDeployedContract(
      context: ActionContext<any, any>,
      payload: DeployedContract
    ) {
      context.commit("setUsingDeployedContract", payload);
    }
  }
};
