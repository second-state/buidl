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
var fa = $("#factory_address").val();
    env.setFactoryContractAddress(fa);
    var contract1 = web3.ss.contract(uniswapFactoryAbi);
    env.setFactoryContractInstance(contract1.at(env.getFactoryContractAddress()));
});

document.querySelector("#token_address_button").addEventListener("click", function() {
var ta = $("#token_address").val();
    env.setTokenAddress(ta);
});

// Create the exchange
var factory_createExchangeEstimate = deployedUniswapFactoryContract.createExchange.estimateGas("0xc4c97929301eb30ff5c9c3150bbbe553768ffbbe", {from:factoryOwner})

document.querySelector("#create_exchange").addEventListener("click", function() {
        // GAS //
    env.setCurrentGasPrice(web3.ss.gasPrice)
    var createExchangeGas = env.getFactoryContractInstance().createExchange.estimateGas(env.getTokenAddress());
    env.getFactoryContractInstance().createExchange(env.getTokenAddress(), {
        gasPrice: env.getCurrentGasPrice(),
        gas: createExchangeGas
    }, function(createExchangeError, createExchangeResult) {
        if (!createExchangeError) {
            $("#create_exchange_result").text("Transaction Hash: " + createExchangeResult.transactionHash + "Address: " + createExchangeResult.address);
        } else {
            console.log(createExchangeError);
        }
    });
});

}
