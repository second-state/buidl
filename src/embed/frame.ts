import Tx from "ethereumjs-tx";
import Buffer from "safe-buffer";
import { Signature } from "../modules/wallet";
const EthUtil = require("ethereumjs-util");
const Secp256k1 = require("secp256k1");
const Crypto = require("crypto");

function newSig(): Signature {
  let privKey;
  do {
    privKey = Crypto.randomBytes(32);
  } while (!Secp256k1.privateKeyVerify(privKey));

  const address = EthUtil.privateToAddress(privKey);
  return new Signature(
    EthUtil.bufferToHex(address),
    EthUtil.bufferToHex(privKey)
  );
}

const storage = window.localStorage.getItem("buidl");
let accounts: Array<any>;
try {
  accounts = JSON.parse(storage as string).wallet.all;
} catch (e) {
  accounts = [];
}
if (accounts.length === 0) {
  for (let i = 0; i < 5; i++) {
    let sig = newSig();
    accounts.push(sig);
  }
  let storeObj = JSON.parse(storage as string);
  if (storeObj === null) {
    storeObj = {};
  }
  storeObj.wallet = {
    all: accounts
  };
  window.localStorage.setItem("buidl", JSON.stringify(storeObj));
}

window.parent.postMessage(
  { accounts: accounts.map((a: any) => a.address) },
  "*"
);

function signTx(
  chainId: string,
  address: string,
  nonce: Number,
  addr: string,
  data: string,
  gasPrice: string,
  gasLimit: string
) {
  let privateKey = "";
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].address === address) {
      privateKey = accounts[i].privateKey;
    }
  }
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

window.addEventListener("message", receiveMsg, false);

function receiveMsg(event: any) {
  const data = event.data;
  if (data.signTx) {
    const st = data.signTx;
    const signedTx = signTx(
      st.chainId,
      st.account,
      st.nonce,
      st.to,
      st.data,
      st.gasPrice,
      st.gasLimit
    );
    window.parent.postMessage({ signedTx: signedTx }, "*");
  } else if (data.importPK) {
    const pk = data.importPK;
    const address = EthUtil.bufferToHex(EthUtil.privateToAddress(pk));

    const store = JSON.parse(window.localStorage.getItem("buidl") as string);
    accounts.push(new Signature(address, pk));
    store.wallet.all = accounts;
    window.localStorage.setItem("buidl", JSON.stringify(store));
    window.parent.postMessage({ importedAccount: address }, "*");
  }
}
