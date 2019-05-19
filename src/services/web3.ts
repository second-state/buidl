import Web3 from "web3-cmt";

export let web3 = {
  checkProvider: function(url: string, cb: Function) {
    if (!url || !/^http/i.test(url)) {
      return cb("invalid");
    }
    const web3 = new Web3(new Web3.providers.HttpProvider(url));
    web3.cmt.getBlockNumber((error: any, result: any) => {
      if (error) {
        return cb("unreachable");
      }
      return cb("accessible");
    });
  }
};
