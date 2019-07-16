/* eslint-disable */
class ESSS {
    // Search Engine Base URL (Please include protocol. Please do not include trailing slash)
    // Example: https://search-engine.com
    constructor(_searchEngineBaseUrl) {
        this.searchEngineBaseUrl = _searchEngineBaseUrl;
        console.log("Search Engine Base URL set to: " + this.searchEngineBaseUrl);
    }

    getAbiCount() {
        var url = this.searchEngineBaseUrl + "/api/es_get_abi_count";
        return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        jsonResponse = JSON.parse(xhr.responseText);
                        abiCount = jsonResponse["hits"]["total"]
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
                        jsonResponse = JSON.parse(xhr.responseText);
                        allCount = jsonResponse["hits"]["total"]
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
                        jsonResponse = JSON.parse(xhr.responseText);
                        allCount = jsonResponse["hits"]["total"]
                        resolve(allCount);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.open("POST", url, true);
            xhr.send(JSON.stringify());
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