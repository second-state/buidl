import { ActionContext } from "vuex";

export default {
  namespaced: true,
  state: {
    problems: [],
    lityLogs: [],
    dappLogs: [],
    cnsl: []
  },
  mutations: {
    pushProblems(state: any, prob: string) {
      state.problems.push(prob);
    },
    pushLityLogs(state: any, log: string) {
      state.lityLogs.push(log);
    },
    pushDappLogs(state: any, log: string) {
      state.dappLogs.push(log);
    },
    pushCnsl(state: any, cnsl: string) {
      state.cnsl.push(cnsl);
    }
  },
  actions: {
    pushProblems(context: ActionContext<any, any>, payload: string) {
      context.commit("pushProblems", payload);
    },
    pushLityLogs(context: ActionContext<any, any>, payload: string) {
      context.commit("pushLityLogs", payload);
    },
    pushDappLogs(context: ActionContext<any, any>, payload: string) {
      context.commit("pushDappLogs", payload);
    },
    pushCnsl(context: ActionContext<any, any>, payload: string) {
      context.commit("pushCnsl", payload);
    }
  }
};
