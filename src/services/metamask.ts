import store from "@/store";

function installed(): object | undefined {
  const web3 = (window as any).web3;
  const ethereum = (window as any).ethereum;
  return (
    web3 &&
    web3.currentProvider &&
    web3.currentProvider.isMetaMask === true &&
    (web3.eth || web3.cmt) &&
    ethereum
  );
}

function connect(cb: Function) {
  if (!installed()) {
    cb("notInstalled");
  }
  const web3 = (window as any).web3;
  const ethereum = (window as any).ethereum;
  const ss = web3.eth || web3.cmt;
  ss.getAccounts((err: any, accounts: Array<string>) => {
    if (err !== null) {
      cb("notAuthorized");
    } else {
      if (accounts === null || accounts.length === 0) {
        ethereum.enable((err: any, accounts: Array<string>) => {
          if (err !== null || accounts === null || accounts.length === 0) {
            cb("notAuthorized");
          } else {
            cb("authorized");
          }
        });
      } else {
        cb("authorized");
      }
    }
  });
}

export default {
  installed,
  connect
};

const interval = setInterval(() => {
  if (installed()) {
    clearInterval(interval);
    store.dispatch("prefs/addMetaMask");
    if (store.state.prefs.web3Provider.usingMetaMask) {
      store.dispatch(
        "prefs/setWeb3ProviderUsing",
        "" + (store.state.prefs.web3Provider.options.length - 1)
      );
    }
  }
}, 5000);
