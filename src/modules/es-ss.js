/* eslint-disable */
class ESSS {
    // Search Engine Base URL (Please include protocol. Please do not include trailing slash)
    // Example: https://search-engine.com
    constructor(_searchEngineBaseUrl) {
        this.searchEngineBaseUrl = _searchEngineBaseUrl;
        console.log("Search Engine Base URL set to: " + this.searchEngineBaseUrl);
    }

    updateStateOfContractAddress(_abi, _address) {
        var url = this.searchEngineBaseUrl + "/api/update_state_of_contract_address";
        return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            //data
            var data = {};
            data["abi"] = _abi;
            data["address"] = _address;
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

module.exports = ESSS;
