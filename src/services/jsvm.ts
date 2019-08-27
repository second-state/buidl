import VM from "ethereumjs-vm";
import * as util from "ethereumjs-util";
import Account from "ethereumjs-account";
import Transaction from "ethereumjs-tx";
import store from "@/store";
import PStateManager from "../../node_modules/ethereumjs-vm/dist/state/promisified";
const abi = require("ethereumjs-abi");
const remixLib = require("remix-lib");

class jsvm {
  vm: VM;
  psm: PStateManager;
  account: Account;
  accountAddress: Buffer;
  web3Providers: any;
  accountPk = new Buffer(
    "e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109",
    "hex"
  );

  constructor() {
    this.accountAddress = util.privateToAddress(this.accountPk);
    this.account = new Account({ balance: 1e18 });

    this.vm = new VM();
    this.psm = new PStateManager(this.vm.stateManager);
    this.bind();

    this.web3Providers = new remixLib.vm.Web3Providers();
    this.web3Providers.addVM("VM", this.vm);
    this.web3Providers.get("VM", (error: any, obj: any) => {
      if (error) {
        var mes = "provider TEST not defined";
        console.log(mes);
      } else {
        this.vm.web3 = obj;
      }
    });
  }

  async bind() {
    await this.psm.putAccount(this.accountAddress, this.account);
  }

  async deployContract(
    deploymentBytecode: string,
    params: any[],
    types: any[]
  ): Promise<any> {
    // Contracts are deployed by sending their deployment bytecode to the address 0
    // The contract params should be abi-encoded and appended to the deployment bytecode.
    let data: any;
    if (params.length != 0) {
      const param = abi.rawEncode(types, params);
      data = deploymentBytecode + param.toString("hex");
    } else {
      data = deploymentBytecode;
    }

    store.dispatch(
      `outputs/pushLityLogs`,
      `Tx has been sent, waiting for comfirmation...`
    );

    const tx = new Transaction({
      value: 0,
      gasLimit: 2000000,
      gasPrice: 1,
      data: data
    });

    tx.sign(this.accountPk);
    const result = await this.vm.runTx({
      tx: tx,
      skipNonce: true,
      skipBalance: true
    });

    if (result.execResult.exceptionError) {
      throw result.execResult.exceptionError;
    }

    // get the contract Address
    const contractAddress = result.createdAddress!;

    const c = {
      address: util.bufferToHex(contractAddress),
      transactionHash: util.bufferToHex(tx.hash())
    };

    store.dispatch(
      `outputs/pushLityLogs`,
      `${util.bufferToHex(
        contractAddress
      )} <span class="success">Success</span>`
    );
    return c;
  }

  async call(
    contractAddress: Buffer,
    functionName: string,
    params: any[],
    inputTypes: any[],
    outputTypes: any[]
  ) {
    let data: any;
    if (params.length != 0) {
      const param = abi.rawEncode(inputTypes, params);
      data = abi.methodID(functionName, []) + param.toString("hex");
    } else {
      data = abi.methodID(functionName, []);
    }

    const result = await this.vm.runCall({
      to: contractAddress,
      caller: this.accountAddress,
      origin: this.accountAddress,
      data: data
    });

    if (result.execResult.exceptionError) {
      throw result.execResult.exceptionError;
    }

    // return data
    if (outputTypes.length != 0) {
      const results = abi.rawDecode(outputTypes, result.execResult.returnValue); // return BN
      return results[0];
    }
    return null;
  }

  async transact(
    contractAddress: Buffer,
    functionName: string,
    params: any[],
    inputTypes: any[],
    outputTypes: any[]
  ) {
    store.dispatch(
      `outputs/pushLityLogs`,
      `Tx has been sent, waiting for comfirmation...`
    );

    let data: any;
    if (params.length != 0) {
      const param = abi.rawEncode(inputTypes, params);
      data =
        "0x" +
        abi.methodID(functionName, ["string"]).toString("hex") +
        param.toString("hex");
    } else {
      data = "0x" + abi.methodID(functionName, ["string"]).toString("hex");
    }

    const tx = new Transaction({
      to: contractAddress,
      value: 0,
      gasLimit: 2000000,
      gasPrice: 1,
      data: data
    });

    tx.sign(this.accountPk);

    const result = await this.vm.runTx({
      tx: tx,
      skipNonce: true,
      skipBalance: true
    });

    if (result.execResult.exceptionError) {
      throw result.execResult.exceptionError;
    }

    const hash = util.bufferToHex(tx.hash());
    store.dispatch(
      `outputs/pushLityLogs`,
      `${hash} <span class="success">Success</span>`
    );

    if (outputTypes.length != 0) {
      const results = abi.rawDecode(outputTypes, result.execResult.returnValue);
      return results[0];
    }
    return null;
  }
}
export default new jsvm();
