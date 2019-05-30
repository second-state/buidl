import { ActionContext } from "vuex";

export default {
  namespaced: true,
  state: {
    contracts: {}
  },
  mutations: {
    setContracts(state: any, contracts: object) {
      state.contracts = contracts;
    }
  },
  actions: {
    setContracts(context: ActionContext<any, any>, payload: object) {
      context.commit("setContracts", payload);
    }
  }
};
