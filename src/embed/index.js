import Web3 from "web3-ss";
const ES = require("../modules/es-ss.js");
import './index.styl'

window.esss = new ES(window.BuidlProviders.es.url);

const LityWeb3 = function(provider) {
  Web3.call(this, provider);

  this.ss.sendTransaction = (transactionObject, callback) => {
    const from = window.BuidlG.selectedAccount;
    const nonce = this.ss.getTransactionCount(from);
    window.BuidlG.cb = callback;
    window.BuidlG.frame.postMessage({
      signTx: {
        chainId: window.BuidlProviders.web3.chainId,
        account: from,
        nonce: nonce,
        to: transactionObject.to,
        data: transactionObject.data,
        gasPrice: window.BuidlProviders.web3.gasPrice,
        gasLimit: window.BuidlProviders.web3.gasLimit
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

const web3 = new LityWeb3(new Web3.providers.HttpProvider(window.BuidlProviders.web3.url));

const embedFrame = document.createElement("iframe");
embedFrame.src = "https://buidl.secondstate.io/embed/frame.html";
embedFrame.style.display = "none";
document.body.appendChild(embedFrame);

window.addEventListener("message", receiveMsg, false);

function receiveMsg(event) {
  const data = event.data;
  if (data.accounts) {
    window.BuidlG.accounts = data.accounts;
    window.BuidlG.frame = event.source;
    settleUI(window.BuidlG.accounts);
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

web3.ss.getAccounts = (cb) => {
  if (!window.BuidlG.selectedAccount) {
    setTimeout(function() {
      web3.ss.getAccounts(cb);
    }, 100);
  } else {
    cb(null, [window.BuidlG.selectedAccount]);
  }
};

// Settle ui
function settleUI(accounts) {
  const triggerMask = document.createElement("div");
  triggerMask.className = "web3-trigger-mask";
  document.body.appendChild(triggerMask);
  triggerMask.style.display = "none";

  const floatTrigger = document.createElement("div");
  floatTrigger.className = "web3-float-trigger";
  document.body.appendChild(floatTrigger);

  const store = window.localStorage.getItem("buidl-embed");
  let storeAccount = null;
  if (store) {
    try {
      storeAccount = JSON.parse(store).selectedAccount;
    } catch(e) {}
  }

  window.BuidlG.selectedAccount = accounts[0];
  
  let options = "";
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i] === storeAccount) {
      options += `<option value="${accounts[i]}" selected>${accounts[i]}</option>`;
      window.BuidlG.selectedAccount = storeAccount;
    } else {
      options += `<option value="${accounts[i]}">${accounts[i]}</option>`;
    }
  }

  floatTrigger.innerHTML = `
    <div class="wt-handle">
      <span class="wt-left-arrow"></span>
    </div>
    <div class="wt-close">
      <span class="wt-right-arrow"></span>
      <span class="wt-left-arrow"></span>
    </div>
    <div class="wt-account-selector" style="display:none;">
      <label>Select Account</label>
      <select>
        ${options}
      </select>
    </div>
  `;

  let expanded = false;

  const accountSelector = document.querySelector(".web3-float-trigger .wt-account-selector select");

  document.querySelector(".web3-float-trigger .wt-close").addEventListener("click", function() {
    floatTrigger.remove();
    triggerMask.remove();
  });

  document.querySelector(".web3-float-trigger .wt-handle").addEventListener("click", function() {
    if (expanded) {
      this.children[0].className = "wt-left-arrow";
      triggerMask.style.display = "none";
      accountSelector.parentElement.style.display = "none";
      expanded = false;
    } else {
      this.children[0].className = "wt-left-arrow wt-rotate";
      triggerMask.style.display = "block";
      accountSelector.parentElement.style.display = "block";
      expanded = true;
    }
  });

  triggerMask.addEventListener("click", function() {
    document.querySelector(".web3-float-trigger .wt-handle").children[0].className = "wt-left-arrow";
    triggerMask.style.display = "none";
    accountSelector.parentElement.style.display = "none";
    expanded = false;
  })

  accountSelector.addEventListener("change", function() {
    window.BuidlG.selectedAccount = window.BuidlG.accounts[this.selectedIndex];
    window.localStorage.setItem("buidl-embed", JSON.stringify({selectedAccount: window.BuidlG.selectedAccount}));
  })
}

