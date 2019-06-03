import Web3 from "web3-cmt";
import Tx from "ethereumjs-tx";
import store from "@/store";
import Buffer from "safe-buffer";

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

function signTx(privateKey: string, nonce: Number, addr: string, data: string) {
  const provider = store.state.prefs.web3Provider;
  const chainId =
    provider.using !== ""
      ? provider.options[provider.using].chainId
      : provider.custom.chainId;
  const rawTx = {
    nonce: nonce,
    gasPrice: "0x77359400",
    gasLimit: "0x" + Number(10000000).toString(16),
    to: addr,
    value: 0,
    data: data,
    chainId: Number(chainId)
  };
  const tx = new Tx(rawTx);
  const pk = Buffer.Buffer.from(privateKey.replace("0x", ""), "hex");
  tx.sign(pk);
  return "0x" + tx.serialize().toString("hex");
}

const LityWeb3 = function(this: any, provider: any) {
  Web3.call(this, provider);

  this.lity = this.cmt;

  const sendTx = this.lity.sendTransaction;

  this.lity.sendTransaction = (transactionObject: any, callback?: Function) => {
    const from = store.state.wallet.default;
    if (!from) {
      alert("Please set the default wallet first.");
      return;
    }
    const nonce = this.lity.getTransactionCount(from.address);
    const s = signTx(
      from.privateKey,
      nonce,
      transactionObject.to,
      transactionObject.data
    );
    this.lity.sendRawTransaction(s, function(err: any, hash: string) {
      if (err) {
        console.error(err);
      }
      console.log(hash);
    });
  };
} as any;

LityWeb3.prototype = Object.create(Web3.prototype);
LityWeb3.prototype.constructor = LityWeb3;

export default LityWeb3;
