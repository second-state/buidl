import Web3 from "web3-ss";
import Tx from "ethereumjs-tx";
import store from "@/store";
import Buffer from "safe-buffer";
import metamask from "@/services/metamask";

export let web3 = {
  checkProvider: function(url: string, cc: number, cb: Function) {
    if (url === "MetaMask") {
      metamask.connect((result: string) => {
        switch (result) {
          case "notInstalled":
            return cb("invalid", cc);
          case "notAuthorized":
            return cb("toAuthorize", cc);
          default: {
            const web3 = (window as any).web3;
            const ss = web3.eth || web3.cmt;
            ss.getBlockNumber((error: any, result: any) => {
              if (error) {
                return cb("unreachable", cc);
              }
              return cb("accessible", cc, result);
            });
          }
        }
      });
    } else {
      if (!url || !/^http/i.test(url)) {
        return cb("invalid", cc);
      }
      const web3 = new Web3(new Web3.providers.HttpProvider(url));
      web3.ss.getBlockNumber((error: any, result: any) => {
        if (error) {
          return cb("unreachable", cc);
        }
        return cb("accessible", cc, result);
      });
    }
  }
};

function signTx(
  privateKey: string,
  nonce: Number,
  addr: string,
  data: string,
  gasPrice: number,
  gasLimit: number
) {
  const provider = store.state.prefs.web3Provider;
  const chainId =
    provider.using !== ""
      ? provider.options[provider.using].chainId
      : provider.custom.chainId;
  gasPrice =
    gasPrice != undefined
      ? gasPrice
      : provider.using !== "" || !provider.custom.customGas
      ? provider.default.gasPrice
      : provider.custom.gasPrice;
  gasLimit =
    gasLimit != undefined
      ? gasLimit
      : provider.using !== "" || !provider.custom.customGas
      ? provider.default.gasLimit
      : provider.custom.gasLimit;
  const rawTx = {
    nonce: nonce,
    gasPrice: "0x" + Number(gasPrice).toString(16),
    gasLimit: "0x" + Number(gasLimit).toString(16),
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

const LityWeb3 = function(this: any, provider: string, type: string) {
  Web3.call(this, new Web3.providers.HttpProvider(provider));
  this.cb = new Web3Cb(type, this);

  this.ss.sendTransaction = (transactionObject: any, callback?: Function) => {
    const from = store.state.wallet.default;
    if (!from) {
      alert("Please set the default wallet first.");
      return;
    }
    const nonce = this.ss.getTransactionCount(from.address);
    const s = signTx(
      from.privateKey,
      nonce,
      transactionObject.to,
      transactionObject.data,
      transactionObject.gasPrice,
      transactionObject.gas
    );
    this.ss.sendRawTransaction(s, this.cb.sendTx(callback));
  };
} as any;

LityWeb3.prototype = Object.create(Web3.prototype);
LityWeb3.prototype.constructor = LityWeb3;

LityWeb3.prototype.checkTx = function(hash: string) {
  this.ss.getTransactionReceipt(hash, this.cb.checkTx(hash));
};

const Web3Cb = function(this: any, type: string, web3: object) {
  this.type = type;
  this.web3 = web3;
} as any;

Web3Cb.prototype.constructor = Web3Cb;

Web3Cb.prototype.sendTx = function(callback: Function): Function {
  store.dispatch(`events/set${this.type}OutputTab`, "logs");
  return (err: any, hash: string) => {
    if (err) {
      store.dispatch(
        `outputs/push${this.type}Logs`,
        `<span class="error">${err}</span>`
      );
      callback && callback(err);
      return;
    }
    store.dispatch(
      `outputs/push${this.type}Logs`,
      `Tx has been sent, waiting for comfirmation...`
    );
    callback && callback(null, hash);
    this.web3.checkTx(hash);
  };
};

Web3Cb.prototype.checkTx = function(hash: string): Function {
  return (err: any, receipt: any) => {
    if (err) {
      store.dispatch(
        `outputs/push${this.type}Logs`,
        `<span class="error">${err}</span>`
      );
    } else if (!receipt) {
      const provider = store.state.prefs.web3Provider;
      const interval =
        provider.using !== "" || !provider.custom.customGas
          ? provider.confirmInterval
          : provider.extendConfirmInterval;
      setTimeout(() => {
        this.web3.checkTx(hash);
      }, interval);
    } else {
      if (receipt.status === "0x1") {
        store.dispatch(
          `outputs/push${this.type}Logs`,
          `${hash} <span class="success">Success</span>`
        );
        if (receipt.contractAddress) {
          const c = {
            address: receipt.contractAddress,
            txHash: receipt.transactionHash
          };
          store.dispatch("deployed/updateContractAddress", c);
        }
      } else {
        store.dispatch(
          `outputs/push${this.type}Logs`,
          `${hash} <span class="error">Failed</span>`
        );
      }
    }
  };
};

export default function(provider: string, type: string): any {
  if (provider === "MetaMask") {
    if (!metamask.installed()) {
      alert("MetaMask is not installed.");
      return;
    }
    const web3 = Object.assign(
      {
        cb: null as any,
        ss: null as any,
        checkTx: function(hash: string) {
          this.ss.getTransactionReceipt(hash, this.cb.checkTx(hash));
        }
      },
      (window as any).web3
    );
    web3.cb = new Web3Cb(type, web3);
    web3.ss = web3.eth || web3.cmt;
    if (!web3.ss.originSendTx) {
      web3.ss.originSendTx = web3.ss.sendTransaction;
    }
    web3.ss.sendTx = web3.ss.originSendTx;
    web3.ss.sendTransaction = (transactionObject: any, callback?: Function) => {
      web3.ss.sendTx(transactionObject, web3.cb.sendTx(callback));
    };
    return web3;
  } else {
    return new LityWeb3(provider, type);
  }
}
