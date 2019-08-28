import { ActionContext } from "vuex";

export interface DeployedContract {
  name: string;
  abi: string;
  bytecode: string;
  address: string;
  txHash: string;
  provider: string;
}

export default {
  namespaced: true,
  state: {
    contracts: []
  },
  mutations: {
    pushContract(state: any, contract: DeployedContract) {
      state.contracts.push(contract);
    },
    updateContractAddress(state: any, contract: DeployedContract) {
      for (let i = 0; i < state.contracts.length; i++) {
        const c = state.contracts[i];
        if (c.txHash === contract.txHash) {
          c.address = contract.address;
          break;
        }
      }
    }
  },
  actions: {
    pushContract(context: ActionContext<any, any>, payload: DeployedContract) {
      context.commit("pushContract", payload);
    },
    updateContractAddress(
      context: ActionContext<any, any>,
      payload: DeployedContract
    ) {
      context.commit("updateContractAddress", payload);
    }
  }
};
