# Uniswap deployment using SecondState's BUIDL IDE

This page contains a blow by blow example of how to initialize, deploy and then interact with the Uniswap Smart Contracts. All work will be performed using SecondState's BUIDL IDE.

# Housekeeping
This demonstration uses both JQuery and Boostrap. Please add the following URLs to the resources section of BUIDL

Javascript
https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js

CSS
https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css

# Preparing your BUIDL IDE environment
Please cut and paste the [demo.html](https://github.com/second-state/buidl/blob/master/demo/uniswap/demo.html) and [demo.js](https://github.com/second-state/buidl/blob/master/demo/uniswap/demo.js) files into your BUIDL IDE's DApp section and then push the "Run" button (situated in the top left corner of the BUIDL IDE's DApp section). Please note, we will not be using the BUIDL IDE's "Contract" section because these Uniswap Vyper contracts have already been compiled (and are readily available at the Uniswap repository).

# Running the demonstration

## Uniswap contract source code, ABI and bytecode
Please note, we have already downloaded and included the the Uniswap Factory contract's [ABI](https://raw.githubusercontent.com/Uniswap/contracts-vyper/master/abi/uniswap_factory.json) and [Bytecode](https://raw.githubusercontent.com/Uniswap/contracts-vyper/master/bytecode/factory.txt) as well as the Uniswap Exchange contract's [ABI](https://raw.githubusercontent.com/Uniswap/contracts-vyper/master/abi/uniswap_exchange.json) and [Bytecode](https://raw.githubusercontent.com/Uniswap/contracts-vyper/master/bytecode/factory.txt) in the demonstration source code files. All you have to do is execute the deployment of the contracts, by clicking this demonstration's buttons.

## Token contract source code, ABI and bytecode




