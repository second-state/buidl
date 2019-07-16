import { ActionContext } from "vuex";

export interface DeployedContract {
  name: string;
  abi: string;
  bytecode: string;
  address: string;
}

export default {
  namespaced: true,
  state: {
    contracts: []
  },
  mutations: {
    pushContract(state: any, contract: DeployedContract) {
      state.contracts.push(contract);
    }
  },
  actions: {
    pushContract(context: ActionContext<any, any>, payload: DeployedContract) {
      context.commit("pushContract", payload);
    }
  }
};
