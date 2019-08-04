import Web3 from "web3-ss";

const LityWeb3 = function(provider) {
  Web3.call(this, provider);

  this.ss.sendTransaction = (transactionObject, callback) => {
    const from = window.BuidlG.accounts[0];
    const nonce = this.ss.getTransactionCount(from);
    window.BuidlG.cb = callback;
    window.BuidlG.frame.postMessage({
      signTx: {
        chainId: "27183",
        account: from,
        nonce: nonce,
        to: transactionObject.to,
        data: transactionObject.data
      }
    }, "*");
  };
};

LityWeb3.prototype = Object.create(Web3.prototype);
LityWeb3.prototype.constructor = LityWeb3;

LityWeb3.prototype.checkTx = function(hash) {
  this.ss.getTransactionReceipt(hash, (err, receipt) => {
    if (err) {
      console.error(err);
    } else if (!receipt) {
      const interval = 1 * 1000;
      setTimeout(() => {
        this.checkTx(hash);
      }, interval);
    } else {
      if (receipt.status === "0x1") {
        console.log("success");
        if (receipt.contractAddress) {
          const c = {
            address: receipt.contractAddress,
            txHash: receipt.transactionHash
          };
        }
      } else {
        console.log("failed");
      }
    }
  });
};

const web3 = new LityWeb3(new Web3.providers.HttpProvider("https://devchain.secondstate.io:8545"));

const embedFrame = document.createElement("iframe");
embedFrame.src = "http://localhost:8080/embed/frame.html";
embedFrame.style.display = "none";
document.body.appendChild(embedFrame);

window.addEventListener("message", receiveMsg, false);

function receiveMsg(event) {
  const data = event.data;
  if (data.accounts) {
    window.BuidlG.accounts = data.accounts;
    window.BuidlG.frame = event.source;
  } else if (data.signedTx) {
    web3.ss.sendRawTransaction(data.signedTx, (err, hash) => {
      if (err) {
        console.error(err);
        window.BuidlG.cb && window.BuidlG.cb(err);
        return;
      }
      console.log("Tx has been sent, waiting for comfirmation...");
      window.BuidlG.cb && window.BuidlG.cb(null, hash);
      web3.checkTx(hash);
    });
  }
}

window.web3 = web3;
window.BuidlG = {};



