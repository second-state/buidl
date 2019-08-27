import { ActionContext } from "vuex";

export class Signature {
  public address: string;
  private privateKey: string;

  constructor(addr: string, pk: string) {
    this.address = addr;
    this.privateKey = pk;
  }
}

export default {
  namespaced: true,
  state: {
    all: [],
    default: undefined
  },
  mutations: {
    addSig(state: any, sig: Signature) {
      for (let i = 0; i < state.all.length; i++) {
        if (state.all[i].address === sig.address) {
          return;
        }
      }
      state.all.push(sig);
    },
    removeSig(state: any, index: number) {
      state.all.splice(index, 1);
    },
    setDefault(state: any, sig: Signature) {
      state.default = sig;
    }
  },
  actions: {
    addSig(context: ActionContext<any, any>, payload: Signature) {
      context.commit("addSig", payload);
    },
    removeSig(context: ActionContext<any, any>, payload: number) {
      context.commit("removeSig", payload);
    },
    setDefault(context: ActionContext<any, any>, payload: Signature) {
      context.commit("setDefault", payload);
    }
  }
};
