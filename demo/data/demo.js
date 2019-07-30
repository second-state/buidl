/* Don't modify */
var abi = [{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
var bytecode = '608060405234801561001057600080fd5b5060df8061001f6000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60aa565b6040518082815260200191505060405180910390f35b8060008190555050565b600080549050905600a165627a7a72305820059f37cec42b77564cde89caa635fe7ef4cc9b16595b3c715387bd950e3ed2490029';
var contract = web3.ss.contract(abi);
var instance = contract.at('');
/* Don't modify */

reload();

function reload () {
  document.querySelector("#create").innerHTML = "Create a new storage contract";
  var tbodyInner = "";
  esss.shaAbi(JSON.stringify(abi)).then((shaResult) => {
    var sha = JSON.parse(shaResult).abiSha3;
    esss.searchUsingAbi(sha).then((searchResult) => {
      var items = JSON.parse(searchResult);
      items.sort(compareItem);
      items.forEach(function(item) {
        tbodyInner = tbodyInner + 
          "<tr id='" + item.contractAddress + "'><td>" + item.blockNumber + 
          "</td><td>" + item.functionData.get + 
          "</td><td><button class='btn btn-info' onclick='setData(this)'>Set</button></td></tr>";
      }); // end of JSON iterator
      document.querySelector("#tbody").innerHTML = tbodyInner;
    });
  }); // end of esss
}

function create (element) {
  element.innerHTML = "Wait ...";
  var data = '0x' + contract.new.getData({data:bytecode});
  contract.new({
    data: data
  }, function (ee, i) {
    if (!ee && i.address != null) {
      esss.submitAbi(JSON.stringify(abi), i.transactionHash);
      setTimeout(function () {
        reload ();
      }, 5 * 1000);
    }
  });
}

function setData (element) {
  var tr = element.closest("tr");
  console.log("Set Data " + tr.id);
  instance = contract.at(tr.id);
  var n = window.prompt("Input a number:");
  n && instance.set(n);
  element.innerHTML = "Wait ...";
  setTimeout(function () {
    instance.get.call (function (e, r) {
      if (!e) {
        element.closest("td").previousSibling.innerHTML = r;
        element.innerHTML = "Set";
      }
    });
  }, 2 * 1000);
}

function compareItem (a, b) {
  let comparison = 0;
  if (a.blockNumber < b.blockNumber) {
    comparison = 1;
  } else if (a.blockNumber > b.blockNumber) {
    comparison = -1;
  }
  return comparison;
}
