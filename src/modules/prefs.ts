import { ActionContext } from "vuex";
import * as monaco from "monaco-editor";

export interface Web3Provider {
  url: string;
  chainId: string;
}

export default {
  namespaced: true,
  state: {
    site: "lity",
    darkTheme: false,
    web3Provider: {
      options: [
        {
          url: "https://rpc.cybermiles.io:8545",
          chainId: "18"
        }
      ],
      using: "0",
      custom: {
        url: "",
        chainId: ""
      },
      status: "pending"
    }
  },
  mutations: {
    toggleTheme(state: any) {
      state.darkTheme = !state.darkTheme;
      window.document.body.className = state.darkTheme ? "dark-theme" : "";
      monaco.editor.setTheme(state.darkTheme ? "vs-dark" : "");
    },
    switchSite(state: any, site: string) {
      state.site = site;
    },
    setWeb3ProviderUsing(state: any, using: string) {
      state.web3Provider.using = using;
    },
    setWeb3ProviderCustom(state: any, custom: Web3Provider) {
      state.web3Provider.custom = custom;
    },
    setWeb3ProviderStatus(state: any, status: string) {
      state.web3Provider.status = status;
    }
  },
  actions: {
    toggleTheme(context: ActionContext<any, any>) {
      context.commit("toggleTheme");
    },
    switchSite(context: ActionContext<any, any>, payload: string) {
      context.commit("switchSite", payload);
    },
    setWeb3ProviderUsing(context: ActionContext<any, any>, payload: string) {
      context.commit("setWeb3ProviderUsing", payload);
    },
    setWeb3ProviderCustom(
      context: ActionContext<any, any>,
      payload: Web3Provider
    ) {
      context.commit("setWeb3ProviderCustom", payload);
    },
    setWeb3ProviderStatus(context: ActionContext<any, any>, payload: string) {
      context.commit("setWeb3ProviderStatus", payload);
    }
  }
};
