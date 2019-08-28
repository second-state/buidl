import * as util from 'ethereumjs-util'
import Account from 'ethereumjs-account'
import Transaction from 'ethereumjs-tx'
import store from "@/store";
const abi = require('ethereumjs-abi')
const remixLib = require('remix-lib')
const VM  = require('ethereumjs-vm')
const Trie = require("merkle-patricia-tree");
const Block = require('ethereumjs-block')

class jsvm{
  vm: any;
  account: Account;
  accountAddress: Buffer;
  web3Providers: any;
  stateTrie: any;
  accountPk = new Buffer(
    'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    'hex',
  )
  self = this;
  constructor(){
    console.log("new instance")
    this.accountAddress = util.privateToAddress(this.accountPk)
    //console.log('Account:', util.bufferToHex(this.accountAddress))
  
    this.account = new Account({ balance: 1e18 })
    this.vm = new VM()
    this.vm.stateManager.putAccountBalance(this.accountAddress, 'f00000000000000001', function cb () {})

    this.web3Providers = new remixLib.vm.Web3Providers()
    this.web3Providers.addVM('VM', this.vm)
    this.web3Providers.get('VM', (error: any, obj: any) => {
      if (error) {
        var mes = 'provider TEST not defined'
        console.log(mes)
      } else {
        this.vm.web3 = obj
      }
    })
    console.log(this.web3Providers)
  }
  
  deployContract(
    deploymentBytecode: string,
    params: any[],
    types: any[],
    cb: Function
  ){
    // create data
    let data: any
    if(params.length!=0){
      const param = abi.rawEncode(types, params)
      data = deploymentBytecode + param.toString('hex')
    }else{
      data = deploymentBytecode
    }

    // send logs
    console.log('Deploying the contract...')
    store.dispatch(
      `outputs/pushLityLogs`,
      `Tx has been sent, waiting for comfirmation...`
    );
      
    // create transaction
    const tx = new Transaction({
      value: 0,
      gasLimit: 2000000, // We assume that 2M is enough,
      gasPrice: 1,
      data: data
    })
  
    // sign and run the transaction 
    tx.sign(this.accountPk)
    var block = new Block({
      header: {
        timestamp: new Date().getTime() / 1000 | 0,
        number: 0
      },
      transactions: [],
      uncleHeaders: []
    })


    this.vm.runTx({ block: block, tx:tx , skipNonce:true, skipBalance:true},
      (err: any,results: any) => {
        if (err) {
          console.log(err)
          return;
        }
        const createdAddress = results.createdAddress
        const c = {
          address:'0x' + createdAddress.toString('hex'),
          transactionHash: util.bufferToHex(tx.hash()),
        }
        store.dispatch(
          `outputs/pushLityLogs`,
          `${c.address} <span class="success">Success</span>`
        );
        console.log(c)
        cb(err, c)
    })
  }

  // not finished 
  call(contractAddress: Buffer, functionName: string,
       params: any[], inputTypes: any[], 
       outputTypes: any[]) {
    console.log('Call the contract...')
    console.log(params)
    let data: any
    if(params.length!=0){
      const param = abi.rawEncode(inputTypes, params)
      data = abi.methodID(functionName, []) + param.toString('hex')
    }else{
      data = abi.methodID(functionName, [])
    }
  
    this.vm.runCall({
      to: contractAddress,
      caller: this.accountAddress,
      origin: this.accountAddress, 
      data: data
    },
      (err: any,result: any) => {
        if (err) {
          console.log(err)
          return;
        }
      }
    )
  }

}
export default new jsvm()