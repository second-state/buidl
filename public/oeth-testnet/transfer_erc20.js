const Web3 = require("web3");
const URL = 'https://testnet.oasiseth.org:8545';

const HDWalletProvider = require('truffle-hdwallet-provider');
// Change the private key for the FROM address
const privateKeys = ['86dad071ad5057c81c0e4f72e760270089c7574a8f2fa6d3cad02151325dadee'];
const provider = new HDWalletProvider(privateKeys, URL, 0, 1);
const web3 = new Web3(provider);
var args = process.argv.slice(2);

const abi = [{ "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "recipient", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_sender", "type": "address" }, { "name": "recipient", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }];

(async () => {
  await web3.eth.net.isListening();
  console.log('Web3 is connected.');

  let accounts = await web3.eth.getAccounts();
  console.log(`accounts: ${JSON.stringify(accounts)}`);

  let contract = new web3.eth.Contract(abi, args[0]);
  console.log(`Contract instaniated at ${args[0]}\n`);

  console.log("Initial balances");
  let balance = await contract.methods.balanceOf(accounts[0]).call();
  console.log(`${accounts[0]} = ${balance}`);
  balance = await contract.methods.balanceOf(args[1]).call();
  console.log(`${args[1]} = ${balance}`);

  await contract.methods.transfer(args[1], args[2]).send({from: accounts[0]}).on('receipt', function(receipt){
    console.log(`Transfer ${args[2]} token from address(${accounts[0]}) to address(${args[1]})\n`);
  });

  console.log("End balances");
  balance = await contract.methods.balanceOf(accounts[0]).call();
  console.log(`${accounts[0]} = ${balance}`);
  balance = await contract.methods.balanceOf(args[1]).call();
  console.log(`${args[1]} = ${balance}`);

  await provider.engine.stop();
})();
