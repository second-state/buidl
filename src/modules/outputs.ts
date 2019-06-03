import { ActionContext } from "vuex";

export default {
  namespaced: true,
  state: {
    problems: [],
    lityLogs: []
  },
  mutations: {
    pushProblems(state: any, prob: string) {
      state.problems.push(prob);
    },
    pushLityLogs(state: any, log: string) {
      state.lityLogs.push(log);
    }
  },
  actions: {
    pushProblems(context: ActionContext<any, any>, payload: string) {
      context.commit("pushProblems", payload);
    },
    pushLityLogs(context: ActionContext<any, any>, payload: string) {
      context.commit("pushLityLogs", payload);
    }
  }
};
