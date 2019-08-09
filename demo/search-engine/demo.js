// Deploy the parent smart contract and also explicitly index it into the smart contract search engine
document.querySelector("#deployParentAndIndex").addEventListener("click", function() {
    abi1 = [{
            "constant": false,
            "inputs": [],
            "name": "incrementParentContractData",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getParentContractData",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "decrementParentContractData",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]

    bytecode1 = "6080604052600160005534801561001557600080fd5b5060f3806100246000396000f3fe608060405260043610604d576000357c0100000000000000000000000000000000000000000000000000000000900480633f794d46146052578063883cba2c146066578063c410260714608e575b600080fd5b348015605d57600080fd5b50606460a2565b005b348015607157600080fd5b50607860b0565b6040518082815260200191505060405180910390f35b348015609957600080fd5b5060a060b9565b005b600160005401600081905550565b60008054905090565b60016000540360008190555056fea165627a7a723058207eab2795aa40c7468822ff8cb7cfa5d1592d9fef60beb7c034a7acb4e605c4f60029";

    var contract1 = web3.ss.contract(abi1);
    var data1 = '0x' + bytecode1;
    contract1.new({
        data: data1,
    }, function(ee, i) {
        if (!ee && i.address != null) {
            console.log("Created item");
            console.log("Transaction Hash:" + i.transactionHash);
            console.log("Address:" + i.address);
            setTimeout(function() {
                console.log("Indexing ABI and TxHash into search engine")
                var abiSubmission = esss.submitAbi(abi1, i.transactionHash);
                abiSubmission.then(function(error, result) {
                        if (!error) {
                            console.log("Item indexed");
                        } else {
                            console.log(error);
                        }
                    })
                    .catch(function() {
                        console.log("Error");
                    });
            }, 5 * 1000);
        }
    });

});