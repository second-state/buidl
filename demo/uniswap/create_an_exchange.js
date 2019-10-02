uniswapFactoryAbi = [{"name": "NewExchange", "inputs": [{"type": "address", "name": "token", "indexed": true}, {"type": "address", "name": "exchange", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "initializeFactory", "outputs": [], "inputs": [{"type": "address", "name": "template"}], "constant": false, "payable": false, "type": "function", "gas": 35725}, {"name": "createExchange", "outputs": [{"type": "address", "name": "out"}], "inputs": [{"type": "address", "name": "token"}], "constant": false, "payable": false, "type": "function", "gas": 187911}, {"name": "getExchange", "outputs": [{"type": "address", "name": "out"}], "inputs": [{"type": "address", "name": "token"}], "constant": true, "payable": false, "type": "function", "gas": 715}, {"name": "getToken", "outputs": [{"type": "address", "name": "out"}], "inputs": [{"type": "address", "name": "exchange"}], "constant": true, "payable": false, "type": "function", "gas": 745}, {"name": "getTokenWithId", "outputs": [{"type": "address", "name": "out"}], "inputs": [{"type": "uint256", "name": "token_id"}], "constant": true, "payable": false, "type": "function", "gas": 736}, {"name": "exchangeTemplate", "outputs": [{"type": "address", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 633}, {"name": "tokenCount", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 663}]

// Create a class to store information
class UniswapEnv {

    constructor() {
        var factoryContractAddress;
        var factoryContractInstance;
        var tokenAddress;
        var tokenInstance;
        var tokenExchangeInstanceAddress;
        var tokenExchangeInstance;
        var currentGasPrice;
    }
    
    // Factory contract address
    getFactoryContractAddress() {
        return this.factoryContractAddress;
    }
    setFactoryContractAddress(_factoryContractAddress) {
        this.factoryContractAddress = _factoryContractAddress;
    }
    
    // Factory contract instance
    getFactoryContractInstance() {
        return this.factoryContractInstance;
    }
    setFactoryContractInstance(_factoryContractInstance) {
        this.factoryContractInstance = _factoryContractInstance;
    }
    
    // Token Address
    getTokenAddress() {
        return this.tokenAddress;
    }
    setTokenAddress(_tokenAddress) {
        this.tokenAddress = _tokenAddress
    }
    
    // Token Instance
    getTokenInstance() {
        return this.tokenInstance;
    }
    setTokenInstance(_tokenInstance) {
        this.tokenInstance = _tokenInstance;
    }
    
    // Gas details
    getCurrentGasPrice() {
        return this.currentGasPrice;
    }
    setCurrentGasPrice(_currentGasPrice) {
        this.currentGasPrice = _currentGasPrice
    }
}
    
// Instantiate Uniswap environment variable
var env = new UniswapEnv();

document.querySelector("#factory_address_button").addEventListener("click", function() {
    $("#factory_address_result").empty();
var fa = $("#factory_address").val();
    env.setFactoryContractAddress(fa);
    var contract1 = web3.ss.contract(uniswapFactoryAbi);
    env.setFactoryContractInstance(contract1.at(env.getFactoryContractAddress()));
    $("#factory_address_result").text("Successfully created factory instance using address: " + fa);
});

document.querySelector("#token_address_button").addEventListener("click", function() {
    $("#token_address_result").empty();
var ta = $("#token_address").val();
    env.setTokenAddress(ta);
    $("#token_address_result").text("Confirmed token address as: " + ta);
});

// Create the exchange
document.querySelector("#create_exchange").addEventListener("click", function() {
    $("#exchange_instance_result").empty();
    // GAS //
    env.setCurrentGasPrice(web3.ss.gasPrice)
    var createExchangeGas = env.getFactoryContractInstance().createExchange.estimateGas(env.getTokenAddress());
    env.getFactoryContractInstance().createExchange(env.getTokenAddress(), {
        gasPrice: env.getCurrentGasPrice(),
        gas: createExchangeGas
    }, function(createExchangeError, createExchangeResult) {
        if (!createExchangeError) {
            // GAS //
            var queryExchangeGas = env.getFactoryContractInstance().getExchange.estimateGas(env.getTokenAddress());
            env.getFactoryContractInstance().getExchange(env.getTokenAddress(), {
                gasPrice: env.getCurrentGasPrice(),
                gas: queryExchangeGas
            }, function(getExchangeError, getExchangeResult) {
                if (!getExchangeError) {
                    $("#exchange_instance_result").text("Exchange is at address: " + getExchangeResult);
                } else {
                    console.log(getExchangeError);
                }
            });
        } else {
            console.log(createExchangeError);
        }
    });
});
