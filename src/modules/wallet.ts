import { ActionContext } from "vuex";

export class Signature {
  private address: string;
  private privateKey: string;

  constructor(addr: string, pk: string) {
    this.address = addr;
    this.privateKey = pk;
  }
}

export default {
  namespaced: true,
  state: {
    all: []
  },
  mutations: {
    addSig(state: any, sig: Signature) {
      state.all.push(sig);
    },
    removeSig(state: any, index: number) {
      state.all.splice(index, 1);
    }
  },
  actions: {
    addSig(context: ActionContext<any, any>, payload: Signature) {
      context.commit("addSig", payload);
    },
    removeSig(context: ActionContext<any, any>, payload: number) {
      context.commit("removeSig", payload);
    }
  }
};
