import Web3 from "web3-ss";
const ES = require("../modules/es-ss.js");
import './index.styl'
const metamask =  require("../services/metamask.js");

window.esss = new ES(window.BuidlProviders.es.url);

const LityWeb3 = function(provider) {
  Web3.call(this, new Web3.providers.HttpProvider(provider));
  this.cb = new Web3Cb(this);

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
        gasPrice: transactionObject.gasPrice != undefined
          ? transactionObject.gasPrice
          : window.BuidlProviders.web3.gasPrice,
        gasLimit: transactionObject.gas != undefined
          ? transactionObject.gas
          : window.BuidlProviders.web3.gasLimit
      }
    }, "*");
  };
};

LityWeb3.prototype = Object.create(Web3.prototype);
LityWeb3.prototype.constructor = LityWeb3;

LityWeb3.prototype.checkTx = function(hash) {
  this.ss.getTransactionReceipt(hash, this.cb.checkTx(hash));
};

var Web3Cb = function(web3) {
  this.web3 = web3;
};

Web3Cb.prototype.constructor = Web3Cb;

Web3Cb.prototype.sendTx = function(cb) {
  return (err, hash) => {
    if (err) {
      console.error(err);
      cb && cb(err);
      return;
    }
    console.log("Tx has been sent, waiting for comfirmation...");
    cb && cb(null, hash);
    this.web3.checkTx(hash);
  };
};

Web3Cb.prototype.checkTx = function(hash) {
  return (err, receipt) => {
    if (err) {
      console.error(err);
    } else if (!receipt) {
      const interval = 1 * 1000;
      setTimeout(() => {
        this.web3.checkTx(hash);
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
  };
};

function MetaWeb3() {
  ethereum.enable();

  const web3 = Object.assign(
    {
      cb: null,
      ss: null,
      checkTx: function(hash) {
        this.ss.getTransactionReceipt(hash, this.cb.checkTx(hash));
      }
    },
    window.web3
  );
  web3.cb = new Web3Cb(web3);
  web3.ss = web3.eth || web3.cmt;
  if (!web3.ss.originSendTx) {
    web3.ss.originSendTx = web3.ss.sendTransaction;
  }
  web3.ss.sendTx = web3.ss.originSendTx;
  web3.ss.sendTransaction = (transactionObject, callback) => {
    web3.ss.sendTx(transactionObject, web3.cb.sendTx(callback));
  };

  return web3;
}

function waitForMetaMask(cb) {
  let navData = window.performance.getEntriesByType("navigation");
  if (navData.length > 0 && navData[0].loadEventEnd > 0) {
    if (metamask.installed()) {
      cb(true);
    } else {
      cb(false);
    }
  } else {
    window.addEventListener('load', () => {
      if (metamask.installed()) {
        cb(true);
      } else {
        cb(false);
      }
    });
  }
}

if (window.BuidlProviders.web3.url === "MetaMask" || window.BuidlProviders.web3.url === "Venus") {
  waitForMetaMask(function(ready) {
    if (ready) {
      metamask.connect(function(result) {
        switch (result) {
          case "notAuthorized":
            alert(`Please authorize connecting to ${window.BuidlProviders.web3.url}.`);
            break;
          case "authorized": {
            window.web3 = MetaWeb3();
            window.dispatchEvent(new Event("web3Ready"));
          }
        }
      });
    } else {
      alert(`${window.BuidlProviders.web3.url} is not available.`)
    }
  });
} else {
  window.BuidlG = {};
  let localStore = {};

  const lweb3 = new LityWeb3(window.BuidlProviders.web3.url);

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
      lweb3.ss.sendRawTransaction(data.signedTx, lweb3.cb.sendTx(window.BuidlG.cb));
    } else if (data.importedAccount) {
      const acc = data.importedAccount;
      const newOption = document.createElement("option");
      newOption.setAttribute("value", acc);
      newOption.appendChild(document.createTextNode(acc));
      const accountSelector = document.querySelector(".web3-float-trigger .wt-account-selector select");
      accountSelector.appendChild(newOption);
      accountSelector.selectedIndex = window.BuidlG.accounts.length;
      window.BuidlG.accounts.push(acc);
      window.BuidlG.selectedAccount = acc;
      localStore.selectedAccount = window.BuidlG.selectedAccount
      window.localStorage.setItem("buidl-embed", JSON.stringify(localStore));
      alert(`${acc}\nhas been imported and selected as default.`);
    }
  }

  lweb3.ss.getAccounts = (cb) => {
    if (!window.BuidlG.selectedAccount) {
      setTimeout(function() {
        lweb3.ss.getAccounts(cb);
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
        localStore = JSON.parse(store);
        storeAccount = localStore.selectedAccount;
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

    if (storeAccount === "MetaMask" || storeAccount === "Venus") {
      options += `<option value="${storeAccount}" selected>${storeAccount}</option>`;
      window.BuidlG.selectedAccount = storeAccount;
      window.BuidlG.accounts.push(storeAccount);
      waitForMetaMask(function(ready) {
        if (ready) {
          metamask.connect(function(result) {
            switch (result) {
              case "notAuthorized":
                alert(`Please authorize connecting to ${storeAccount}.`);
                break;
              case "authorized": {
                window.web3 = MetaWeb3();
                window.dispatchEvent(new Event("web3Ready"));
              }
            }
          });
        } else {
          alert(`${storeAccount} is not available.`);
        }
      });
    } else {
      waitForMetaMask(function(ready) {
        if (ready) {
          const m = window.web3.eth ? "MetaMask" : "Venus";
          const opt = document.createElement("option");
          opt.setAttribute("value", m);
          const t = document.createTextNode(m);
          opt.appendChild(t);
          accountSelector.appendChild(opt);
          window.BuidlG.accounts.push(m);

          // metamask prompt
          if (!localStore.metamaskPrompt) {
            localStore.metamaskPrompt = false;
            const div = document.createElement("div");
            div.className = "metamask-prompt";
            const tx = document.createTextNode(`Opt for using your ${m}`);
            div.appendChild(tx);
            accountSelector.parentElement.insertBefore(div, accountSelector);
            document.querySelector(".web3-float-trigger .wt-handle").dispatchEvent(new Event("click"));
          }
        }
        window.web3 = lweb3;
        window.dispatchEvent(new Event("web3Ready"));
      });
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
        <a href="#" class="import-pk">Import Private Key</a>
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

    function closeMetaMaskPrompt() {
      if (localStore.metamaskPrompt === false) {
        localStore.metamaskPrompt = true;
        document.querySelector(".metamask-prompt").remove();
        window.localStorage.setItem("buidl-embed", JSON.stringify(localStore));
      }
    }

    document.querySelector(".web3-float-trigger .wt-handle").addEventListener("click", function() {
      if (expanded) {
        this.children[0].className = "wt-left-arrow";
        triggerMask.style.display = "none";
        accountSelector.parentElement.style.display = "none";
        expanded = false;
        closeMetaMaskPrompt();
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
      closeMetaMaskPrompt();
    })

    accountSelector.addEventListener("change", function() {
      const selected = window.BuidlG.accounts[this.selectedIndex];
      localStore.selectedAccount = selected;
      window.localStorage.setItem("buidl-embed", JSON.stringify(localStore));
      if (selected === "MetaMask" || selected === "Venus") {
        window.location.reload();
      }
      if (window.BuidlG.selectedAccount === "MetaMask" || window.BuidlG.selectedAccount === "Venus") {
        window.location.reload();
      }
      window.BuidlG.selectedAccount = window.BuidlG.accounts[this.selectedIndex];
    })

    document.querySelector(".web3-float-trigger .wt-account-selector .import-pk").addEventListener("click", function(event) {
      event.preventDefault();
      const pk = window.prompt("Enter your Private Key (Begin with 0x):");
      if (pk !== null) {
        if (/^0x[0-9a-zA-Z]{64}$/.test(pk)) {
          window.BuidlG.frame.postMessage({ importPK: pk }, "*");
        } else {
          alert("Invalid Private Key");
        }
      }
    });
  }
}
