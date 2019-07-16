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
    compiledContract: undefined,
    firstDeployedContract: undefined, // to enable auto injection of contract info within js
    usingDeployedContract: undefined,
    reuseDeployedContract: 0 // used to trigger changing using as using not changed may be rerendered in JS panel
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
    setCompiledContract(state: any, content: DeployedContract) {
      state.compiledContract = content;
    },
    setFirstDeployedContract(state: any, content: DeployedContract) {
      state.firstDeployedContract = content;
    },
    setUsingDeployedContract(state: any, content: DeployedContract) {
      state.usingDeployedContract = content;
    },
    triggerReuseDeployedContract(state: any) {
      state.reuseDeployedContract++;
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
    },
    setFirstDeployedContract(
      context: ActionContext<any, any>,
      payload: DeployedContract
    ) {
      context.commit("setFirstDeployedContract", payload);
    },
    setCompiledContract(
      context: ActionContext<any, any>,
      payload: DeployedContract
    ) {
      context.commit("setCompiledContract", payload);
    },
    triggerReuseDeployedContract(context: ActionContext<any, any>) {
      context.commit("triggerReuseDeployedContract");
    }
  }
};
