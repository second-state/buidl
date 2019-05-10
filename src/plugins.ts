import { Store, MutationPayload } from "vuex";

export function LocalStoragePlugin(store: Store<any>) {
  // called when the store is initialized
  store.subscribe((mutation: MutationPayload, state: Object) => {
    localStorage.setItem("store", JSON.stringify(state));
  });
}
