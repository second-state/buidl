/* Don't modify */
var abi = [{"constant":false,"inputs":[{"name":"_number","type":"uint256"}],"name":"setNumber","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_text","type":"string"}],"name":"setText","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getText","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
var bytecode = '608060405234801561001057600080fd5b50610359806100206000396000f300608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633fb5c1cb146100675780635d3a1f9d14610094578063e00fe2eb146100fd578063f2c9ecd81461018d575b600080fd5b34801561007357600080fd5b50610092600480360381019080803590602001909291905050506101b8565b005b3480156100a057600080fd5b506100fb600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506101c2565b005b34801561010957600080fd5b506101126101dc565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610152578082015181840152602081019050610137565b50505050905090810190601f16801561017f5780820d805160018360200d6101000a0d1916815260200191505b509250505060405180910390f35b34801561019957600080fd5b506101a261027e565b6040518082815260200191505060405180910390f35b8060018190555050565b80600090805190602001906101d8929190610288565b5050565b60606000805460018160011615610100020d166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020d166002900480156102745780601f1061024957610100808354040283529160200191610274565b820191906000526020600020905b8154815290600101906020018083116102575782900d601f168201915b5050505050905090565b6000600154905090565b82805460018160011615610100020d166002900490600052602060002090601f016020900481019282601f106102c957805160ff19168380011785556102f7565b828001600101855582156102f7579182015b828111156102f65782518255916020019190600101906102db565b5b5090506103049190610308565b5090565b61032a91905b8082111561032657600081600090555060010161030e565b5090565b905600a165627a7a723058206a8d5c7b4ec2a6cfc38c7f4e399e278f6443282844a14e939ecbd72e72f5981e0029';
var contract = web3.ss.contract(abi);
var instance = contract.at('');
/* Don't modify */

reload();

function create (element) {
  element.innerHTML = "Wait ...";
  var data = '0x' + contract.new.getData({data:bytecode});
  contract.new({
    data: data
  }, function (ee, i) {
    if (ee) {
      console.log("Error creating contract " + ee);
    } else {
      // May take a few seconds for i.address to return
      setTimeout(function () {
        reload();
      }, 5 * 1000);
    }
  });
}

function reload () {
  document.querySelector("#create").innerHTML = "Create a new storage contract";
  document.querySelector("#tbody").innerHTML = "";
  var tbodyInner = "";
  esss.shaAbi(JSON.stringify(abi)).then((shaResult) => {
    var sha = JSON.parse(shaResult).abiSha3;
    esss.searchUsingAbi(sha).then((searchResult) => {
      var items = JSON.parse(searchResult);
      items.sort(compareItem);
      items.forEach(function(item) {
        tbodyInner = tbodyInner + 
          "<tr id='" + item.contractAddress + "'><td>" + item.blockNumber + 
          "</td><td>" + item.functionData.getNumber + 
          "</td><td>" + item.functionData.getText +
          "</td><td><button class='btn btn-info' onclick='setNumber(this)'>SetNum</button></td>"+
          "</td><td><button class='btn btn-info' onclick='setText(this)'>SetText</button></td></tr>";
      }); // end of JSON iterator

      document.querySelector("#tbody").innerHTML = tbodyInner;
    });
  }); // end of esss
}

function setNumber (element) {
  var tr = element.closest("tr");
  console.log("Set Number " + tr.id);
  instance = contract.at(tr.id);
  var n = window.prompt("Input a number:");
  n && instance.setNumber(n);
  element.innerHTML = "Wait ...";
  setTimeout(function () {
    instance.getNumber.call (function (e, r) {
      if (e) {
        console.log(e);
        return;
      } else {
        element.closest("td").previousSibling.innerHTML = r;
        element.innerHTML = "Set";
      }
    });
  }, 2 * 1000);
}

function setText (element) {
  var tr = element.closest("tr");
  console.log("Set Text " + tr.id);
  instance = contract.at(tr.id);
  var w = window.prompt("Input a word:");
  w && instance.setText(w);
  element.innerHTML = "Wait ...";
  setTimeout(function () {
    instance.getText.call (function (e, r) {
      if (e) {
        console.log(e);
        return;
      } else {
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
