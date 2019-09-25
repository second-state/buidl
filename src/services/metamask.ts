const web3 = (window as any).web3;
const ethereum = (window as any).ethereum;

export default {
  installed(): boolean | undefined {
    return (
      web3 &&
      web3.currentProvider &&
      web3.currentProvider.isMetaMask === true &&
      (web3.eth || web3.cmt) &&
      ethereum
    );
  },
  ss() {
    return web3.cmt || web3.eth;
  }
};
