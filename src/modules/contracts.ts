import { ActionContext } from "vuex";

export default {
  namespaced: true,
  state: {
    contracts: {},
    contracts2: {}
  },
  mutations: {
    setContracts(state: any, contracts: object) {
      state.contracts = contracts;
    },
    setContracts2(state: any, contracts: object) {
      state.contracts2 = contracts;
    }
  },
  actions: {
    setContracts(context: ActionContext<any, any>, payload: object) {
      context.commit("setContracts", payload);
    },
    setContracts2(context: ActionContext<any, any>, payload: object) {
      context.commit("setContracts2", payload);
    }
  }
};
