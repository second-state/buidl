/* Don't modify */
var abi = [{"constant":false,"inputs":[{"name":"_accountBalance","type":"uint256"}],"name":"setAccountBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAccountName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAccountBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_accountName","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
var bytecode = '608060405234801561001057600080fd5b5060405161032a38038061032a833981018060405281019080805182019291905050508060009080519060200190610049929190610050565b50506100f5565b82805460018160011615610100020d166002900490600052602060002090601f016020900481019282601f1061009157805160ff19168380011785556100bf565b828001600101855582156100bf579182015b828111156100be5782518255916020019190600101906100a3565b5b5090506100cc91906100d0565b5090565b6100f291905b808211156100ee5760008160009055506001016100d6565b5090565b90565b610226806101046000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806308aba5aa1461005c578063638dc2b5146100895780636896fabf14610119575b600080fd5b34801561006857600080fd5b5061008760048036038101908080359060200190929190505050610144565b005b34801561009557600080fd5b5061009e61014e565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100de5780820151818401526020810190506100c3565b50505050905090810190601f16801561010b5780820d805160018360200d6101000a0d1916815260200191505b509250505060405180910390f35b34801561012557600080fd5b5061012e6101f0565b6040518082815260200191505060405180910390f35b8060018190555050565b60606000805460018160011615610100020d166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020d166002900480156101e65780601f106101bb576101008083540402835291602001916101e6565b820191906000526020600020905b8154815290600101906020018083116101c95782900d601f168201915b5050505050905090565b60006001549050905600a165627a7a72305820fdcdd97421dfcc38167c684fb15f2a5f0f404fb0f79165df46bc3bf1c022c7ac0029';
var contract = web3.ss.contract(abi);
var instance = contract.at('0x6a0f39327527b4b590c54c9d5032046898a6db87');
/* Don't modify */

reload();

function reload() {
    document.querySelector("#totalBody").innerHTML = "";
    document.querySelector("#individualBody").innerHTML = "";
    var tbodyInner = "";
    esss.shaAbi(JSON.stringify(abi)).then((shaResult) => {
        var sha = JSON.parse(shaResult).abiSha3;
        esss.searchUsingAbi(sha).then((searchResult) => {
            var items = JSON.parse(searchResult);
            items.sort(compareItem);
            items.forEach(function(item) {
                tbodyInner = tbodyInner +
                    "<tr id='" + item.contractAddress + "'><td>" + item.functionData.getAccountName +
                    "</td><td>" + item.functionData.getAccountBalance +
                    "</td><td><button class='btn btn-info' onclick='setNumber(this)'>Update balance</button></td></tr>";
            }); // end of JSON iterator
            document.querySelector("#individualBody").innerHTML = tbodyInner;
            displayTotal();

        });
    }); // end of esss
}

function displayTotal() {
    esss.shaAbi(JSON.stringify(abi)).then((shaResult) => {
        var sha = JSON.parse(shaResult).abiSha3;
        esss.searchUsingAbi(sha).then((searchResult) => {
            var items = JSON.parse(searchResult);
            var totalBodyInner = "";
            var total = 0;
            items.forEach(function(item) {
                total = total + parseInt(item.functionData.getAccountBalance);
            });
            console.log(total)
            totalBodyInner = totalBodyInner + "<tr id='total'><td>" + total + "</tr>";
            document.querySelector("#totalBody").innerHTML = totalBodyInner;
        });
    }); // end of esss
}

function setNumber(element) {
    var tr = element.closest("tr");
    instance = contract.at(tr.id);
    var n = window.prompt("Input a number:");
    n && instance.setAccountBalance(n);
    setTimeout(function() {
        esss.updateStateOfContractAddress(JSON.stringify(abi), instance.address).then((c2i) => {
            element.innerHTML = "Wait ...";
            setTimeout(function() {
                reload();
            }, 5 * 1000);
        });
    }, 1 * 1000);
}

function compareItem(a, b) {
    let comparison = 0;
    if (a.functionData.getAccountName < b.functionData.getAccountName) {
        comparison = -1;
    } else if (a.functionData.getAccountName > b.functionData.getAccountName) {
        comparison = 1;
    }
    return comparison;
}
