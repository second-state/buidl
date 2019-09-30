// Instantiate
document.querySelector("#factory_button").addEventListener("click", function() {
    $("factory_deployment_results").empty();
    var uniswapFactoryContract = web3.ss.contract(uniswapFactoryAbi, function(error, result) {
        if (!error) {
            var factoryContractData = uniswapFactoryContract.new.getData({
                data: uniswapFactoryBytecode
            })
            var factoryEstimate = web3.ss.estimateGas({
                data: factoryContractData
            })
            var deployedUniswapFactoryContract = uniswapFactoryContract.new({
                data: uniswapFactoryBytecode,
                gas: factoryEstimate
            }, function(error, result) {
                if (!error) {
                    console.log("Factory contract address:");
                    console.log(result.address);
                    $("#factory_deployment_results").text(result.address);
                } else {
                    console.log(error)
                }
            });
            console.log(result);
        } else {
            console.log(error)
        }
    });
})
