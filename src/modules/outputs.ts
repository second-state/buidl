import { ActionContext } from "vuex";

export default {
  namespaced: true,
  state: {
    problems: []
  },
  mutations: {
    pushProblems(state: any, prob: string) {
      state.problems.push(prob);
    }
  },
  actions: {
    pushProblems(context: ActionContext<any, any>, payload: string) {
      context.commit("pushProblems", payload);
    }
  }
};
