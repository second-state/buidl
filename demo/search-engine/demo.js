// Deploy the parent smart contract and also explicitly index it into the smart contract search engine
childAbi = [{
        "constant": false,
        "inputs": [],
        "name": "incrementChildContractData",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
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
        "name": "getChildContractData",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
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
        "name": "decrementChildContractData",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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

parentAbi = [{
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

parentBytecode = "6080604052600160005534801561001557600080fd5b5060f9806100246000396000f3006080604052600436106053576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633f794d46146058578063883cba2c14606c578063c4102607146094575b600080fd5b348015606357600080fd5b50606a60a8565b005b348015607757600080fd5b50607e60b6565b6040518082815260200191505060405180910390f35b348015609f57600080fd5b5060a660bf565b005b600160005401600081905550565b60008054905090565b6001600054036000819055505600a165627a7a72305820a779afd88933e906455973801c0af6cf9dfc3856fbe7dcf71eef41a8c376d64c0029";
childBytecode = "608060405260016000556001805534801561001957600080fd5b506101a4806100296000396000f300608060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631da1d5041461007d5780633f794d461461009457806382a7282c146100ab578063883cba2c146100d6578063a20fab9314610101578063c410260714610118575b600080fd5b34801561008957600080fd5b5061009261012f565b005b3480156100a057600080fd5b506100a961013c565b005b3480156100b757600080fd5b506100c061014a565b6040518082815260200191505060405180910390f35b3480156100e257600080fd5b506100eb610154565b6040518082815260200191505060405180910390f35b34801561010d57600080fd5b5061011661015d565b005b34801561012457600080fd5b5061012d61016a565b005b6001805401600181905550565b600160005401600081905550565b6000600154905090565b60008054905090565b6001805403600181905550565b6001600054036000819055505600a165627a7a72305820b1d962ff37313a0aa5a31b4118f46264b9740565e1b684aa1ee31ded89617cd50029";

class ESSS {
    // Search Engine Base URL (Please include protocol. Please do not include trailing slash)
    // Example: https://search-engine.com
    constructor(_searchEngineBaseUrl) {
        this.searchEngineBaseUrl = _searchEngineBaseUrl;
        console.log("Search Engine Base URL set to: " + this.searchEngineBaseUrl);
    }

    updateQualityScore(_contractAddress, _qualityScore) {
        var url = this.searchEngineBaseUrl + "/api/es_update_quality";
        return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            //data
            var data = {};
            data["contractAddress"] = _contractAddress;
            data["qualityScore"] = _qualityScore;
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.send(JSON.stringify(data));
        });
    }

    getMostRecentIndexedBlockNumber() {
        var url = this.searchEngineBaseUrl + "/api/most_recent_indexed_block_number";
        return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest();

            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var jsonResponse = JSON.parse(xhr.responseText);
                        var blockNumber = jsonResponse["aggregations"]["most_recent_block"]["value"]
                        resolve(blockNumber);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.send(JSON.stringify());
        });
    }

    getAbiCount() {
        var url = this.searchEngineBaseUrl + "/api/es_get_abi_count";
        return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var jsonResponse = JSON.parse(xhr.responseText);
                        var abiCount = jsonResponse["hits"]["total"]
                        resolve(abiCount);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.send(JSON.stringify());
        });
    }

    getAllCount() {
        var url = this.searchEngineBaseUrl + "/api/es_get_all_count";
        return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var jsonResponse = JSON.parse(xhr.responseText);
                        var allCount = jsonResponse["hits"]["total"]
                        resolve(allCount);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.send(JSON.stringify());
        });
    }


    getContractCount() {
        var url = this.searchEngineBaseUrl + "/api/es_get_contract_count";
        return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest();

            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var jsonResponse = JSON.parse(xhr.responseText);
                        var allCount = jsonResponse["hits"]["total"]
                        resolve(allCount);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.send(JSON.stringify());
        });
    }

    describeUsingTx(_transactionHash) {
        let url = this.searchEngineBaseUrl + "/api/describe_using_tx";
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            //data
            var data = {};
            data["hash"] = _transactionHash;
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var jsonResponse = JSON.parse(xhr.responseText);
                        var allRecord = JSON.stringify(jsonResponse["hits"]["hits"][0]["_source"]);
                        resolve(allRecord);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(data));
        });
    }

    submitAbi(_abi, _transactionHash) {
        var url = this.searchEngineBaseUrl + "/api/submit_abi";
        return new Promise(function(resolve, reject) {
            // request initialisation
            var xhr = new XMLHttpRequest();

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            //data
            var data = {};
            data["abi"] = _abi;
            data["hash"] = _transactionHash;
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(data));
        });
    }

    submitManyAbis(_abis, _transactionHash) {
        var url = this.searchEngineBaseUrl + "/api/submit_many_abis";
        return new Promise(function(resolve, reject) {
            // request initialisation
            var xhr = new XMLHttpRequest();

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            //data
            var data = {};
            data["abis"] = _abis;
            data["hash"] = _transactionHash;
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(data));
        });
    }


    shaAbi(_abi) {
        var url = this.searchEngineBaseUrl + "/api/sha_an_abi";
        return new Promise(function(resolve, reject) {
            //data
            var data = {};
            data["abi"] = _abi;
            var xhr = new XMLHttpRequest();

            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(data));
        });
    }

    searchUsingAddress(_address) {
        var url = this.searchEngineBaseUrl + "/api/es_search";
        return new Promise(function(resolve, reject) {
            // request initialisation
            var xhr = new XMLHttpRequest();

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            //data
            var data = '{"query":{"bool":{"must":[{"match":{"contractAddress":"' + _address + '"}}]}}}'
            //execution
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var jsonResponse = JSON.parse(xhr.responseText);
                        var allRecord = JSON.stringify(jsonResponse[0]);
                        resolve(allRecord);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        });
    }

    searchUsingAbi(_abiHash) {
        var url = this.searchEngineBaseUrl + "/api/es_search";
        return new Promise(function(resolve, reject) {
            // request initialisation
            var xhr = new XMLHttpRequest();

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            //data
            var data = '{"query":{"bool":{"must":[{"match":{"abiShaList":"' + _abiHash + '"}}]}}}'
            //execution
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        });
    }

    searchUsingKeywords(_keywords) {
        var url = this.searchEngineBaseUrl + "/api/es_search";
        return new Promise(function(resolve, reject) {
            // request initialisation
            var xhr = new XMLHttpRequest();

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            //data
            var listOfKeywords = _keywords["keywords"];
            var string = "";
            var i;
            for (i = 0; i < listOfKeywords.length; i++) {
                if (string.length == 0) {
                    string = string + '"' + listOfKeywords[i];
                } else {
                    string = string + "," + listOfKeywords[i];
                }
            }
            string = string + '"'
            var data = '{"query":{"query_string":{"query":' + string + '}}}';
            console.log(data);
            //execution
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(JSON.parse(data)));
        });
    }

    searchUsingKeywordsAndAbi(_abiHash, _keywords) {
        var url = this.searchEngineBaseUrl + "/api/es_search";
        return new Promise(function(resolve, reject) {
            // request initialisation
            var xhr = new XMLHttpRequest();

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            //data
            var listOfKeywords = _keywords["keywords"];
            var string = "";
            var i;
            for (i = 0; i < listOfKeywords.length; i++) {
                if (string.length == 0) {
                    string = string + '"' + listOfKeywords[i];
                } else {
                    string = string + "," + listOfKeywords[i];
                }
            }
            string = string + '"'
            var data = '{"query":{"bool":{"must":[{"match":{"abiShaList":"' + _abiHash + '"}},{"query_string":{"query":' + string + '}}]}}}';
            console.log(data);
            //execution
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(JSON.parse(data)));
        });
    }
}


// Start of DEMO

var esss2 = new ESSS("https://devchain-es.secondstate.io");
esss2.getMostRecentIndexedBlockNumber().then((theResult) => {
    var blockNumber = JSON.parse(theResult);
    console.log(blockNumber);
})
// Address of contract 1 post deployment
var c1dAddress = "";
// Address of contract 2 post deployment
var c2dAddress = "";

document.querySelector("#c1d").addEventListener("click", function() {
    $("#c1d_deployParentAndIndexExpectation1").empty();
    $("#c1d_deployParentAndIndexResults1").empty();

    var contract1 = web3.ss.contract(parentAbi);
    var data1 = '0x' + parentBytecode;
    contract1.new({
        data: data1,
    }, function(ee, i) {
        if (!ee && i.address != null) {
            console.log("Created item");
            console.log("Transaction Hash:" + i.transactionHash);
            console.log("Address:" + i.address);
            c1dAddress = i.address;

            esss2.shaAbi(JSON.stringify(parentAbi)).then((shaResult1) => {
                var parentSha = JSON.parse(shaResult1).abiSha3;
                $("#c1d_deployParentAndIndexExpectation1").append(parentSha);
            });
            setTimeout(function() {
                console.log("Indexing ABI and TxHash into search engine")
                var abiSubmission = esss2.submitAbi(JSON.stringify(parentAbi), i.transactionHash);
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
            }, 2 * 1000);
            setTimeout(function() {
                console.log("Fetching results from search engine")
                console.log("Using Tx: " + i.transactionHash);
                esss2.describeUsingTx(i.transactionHash).then((txResult) => {
                    var resultToDisplay = JSON.stringify(JSON.parse(txResult).abiShaList[0]);
                    $("#c1d_deployParentAndIndexResults1").text(resultToDisplay.replace(/['"]+/g, ''));
                });
            }, 4 * 1000);
        }
    });
});


document.querySelector("#c1i").addEventListener("click", function() {
    $("#c1i_interactionExpectation1").empty();
    $("#c1i_interactionResult1").empty();
    $("#c1i_interactionExpectation1").append("1");
    console.log("Querying index using address: " + c1dAddress)
    esss2.searchUsingAddress(c1dAddress).then((c1i) => {
        var data = JSON.parse(c1i);
        resultToDisplay = JSON.stringify(data.functionData.getParentContractData);
        $("#c1i_interactionResult1").text(resultToDisplay.replace(/['"]+/g, ''))
    });
});

document.querySelector("#c2d").addEventListener("click", function() {
    $("#c2d_deployParentAndIndexExpectation1").empty();
    $("#c2d_deployParentAndIndexExpectation2").empty();
    $("#c2d_deployParentAndIndexResults1").empty();
    $("#c2d_deployParentAndIndexResults2").empty();

    var contract1 = web3.ss.contract(childAbi);
    var data1 = '0x' + childBytecode;
    contract1.new({
        data: data1,
    }, function(ee, i) {
        if (!ee && i.address != null) {
            console.log("Created item");
            console.log("Transaction Hash:" + i.transactionHash);
            console.log("Address:" + i.address);
            c2dAddress = i.address;
            esss2.shaAbi(JSON.stringify(parentAbi)).then((shaResult1) => {
                var parentSha = JSON.parse(shaResult1).abiSha3;
                $("#c2d_deployParentAndIndexExpectation1").append(parentSha);
            });

            esss.shaAbi(JSON.stringify(childAbi)).then((shaResult2) => {
                var childSha = JSON.parse(shaResult2).abiSha3;
                $("#c2d_deployParentAndIndexExpectation2").append(childSha);
            });
            setTimeout(function() {
                console.log("Indexing ABI and TxHash into search engine")
                var abiSubmission = esss2.submitAbi(JSON.stringify(childAbi), i.transactionHash);
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
            }, 2 * 1000);
            setTimeout(function() {
                console.log("Fetching results from search engine")
                esss2.describeUsingTx(i.transactionHash).then((txResult) => {
                    var resultToDisplay = JSON.parse(txResult).abiShaList;
                    for (var i = 0; i < resultToDisplay.length; i++) {
                        $("#c2d_deployParentAndIndexResults1").append(resultToDisplay[i]);
                        $("#c2d_deployParentAndIndexResults1").append("<br />")
                    }
                });
            }, 10 * 1000);
        }
    });

});


document.querySelector("#c2i").addEventListener("click", function() {
    $("#c2i_interactionExpectation1").empty();
    $("#c2i_interactionResult1").empty();
    $("#c2i_interactionExpectation1").append("1");
    console.log("Querying index using address: " + c2dAddress)
    esss2.getDataUsingAddress(c2dAddress).then((c1i) => {
        var data = JSON.parse(c2i).getParentContractData;
        $("#c2i_interactionResult1").append(data);
    });

});
