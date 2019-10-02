# Uniswap deployment using SecondState's BUIDL IDE

This page contains a blow by blow example of how to initialize, deploy and then interact with the Uniswap Smart Contracts. All work will be performed using SecondState's BUIDL IDE.

# Housekeeping
This demonstration uses both JQuery and Boostrap. Please add the following URLs to the resources section of BUIDL

**Javascript**

https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js

**CSS**

https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css

**Uniswap contract source code, ABI and bytecode**

Please note, we have already downloaded and included the the Uniswap Factory contract's [ABI](https://raw.githubusercontent.com/Uniswap/contracts-vyper/master/abi/uniswap_factory.json) and [Bytecode](https://raw.githubusercontent.com/Uniswap/contracts-vyper/master/bytecode/factory.txt) as well as the Uniswap Exchange contract's [ABI](https://raw.githubusercontent.com/Uniswap/contracts-vyper/master/abi/uniswap_exchange.json) and [Bytecode](https://raw.githubusercontent.com/Uniswap/contracts-vyper/master/bytecode/factory.txt) in the demonstration source code files. All you have to do is execute the deployment of the contracts, by clicking this demonstration's buttons.

## Step 1 - Uniswap Factory Contract

Please cut and paste the [create_factory_contract_&_exchange_template.html](https://raw.githubusercontent.com/second-state/buidl/master/demo/uniswap/create_factory_contract_%26_exchange_template.html) and [create_factory_contract_&_exchange_template.js](https://raw.githubusercontent.com/second-state/buidl/master/demo/uniswap/create_factory_contract_%26_exchange_template.js) files into your BUIDL IDE's DApp section and then push the "Run" button (situated in the top left corner of the BUIDL IDE's DApp section). Please note, we will not be using the BUIDL IDE's "Contract" section because these Uniswap Vyper contracts have already been compiled (and are readily available at the Uniswap repository).

Press the "Deploy Uniswap Factory" button and wait until the contract address of the newly deployed Factory contract is displayed. Please ensure that you save/store this contract address. You will need this later!

## Step 2 - Uniswap Exchange Template
Press the "Deploy Uniswap Ex. Template" button and wait for a minute while the Exchange contract template is also deployed. Once complete, the newly deployed Exchange contract template address will be displayed. Please ensure that you save/store this contract address. You will need it later.

## Step 3 - Link Factory and Exchange Template
At this point we have a Factory contract and an Exchange template contract deployed. We now need these two contracts to be linked. To link these contracts we simply press the "Perform Linking" button.

## Step 4 - ERC20 Token
You can use an existing ERC20 token contract if you have one. If you already have your ERC20 token's ABI and address (as well as ownership of some of those tokens) you can skip this step, and move on to create an exchange (in step 5).

If you would like to create a new ERC20 token for demonstration purposes you can cut and past the [demonstrate_erc20_creation.html](https://raw.githubusercontent.com/second-state/buidl/master/demo/uniswap/demonstrate_erc20_creation.html) and [demonstrate_erc20_creation.js](https://raw.githubusercontent.com/second-state/buidl/master/demo/uniswap/demonstrate_erc20_creation.js) files into the BUIDL IDE and deploy by pressing the `Create new ERC20 token` button. 

* Please note, [the token used here](https://github.com/second-state/buidl/blob/master/demo/uniswap/example_erc20_source_code_file.md) is not intended for production but for demonstration purposes only.

## Step 5 - Create an Exchange (for a specific ERC20 token)
We are going to call the Factory contract's createExchange function which will produce a new instance of an Exchange and return the newly minted address for the Exchange instance. Note that we are passing in the address to an existing ERC20 token. This is the token contract which will be traded against the network token once the exchange is created. Obviously you will need to have the address of an ERC20 token to perform this function.

This step (5) requires the factory contract instance from step 1 and the ERC20 contract address from step 4.

Please paste in the [create_an_exchange.html](https://raw.githubusercontent.com/second-state/buidl/master/demo/uniswap/create_an_exchange.html) and [create_an_exchange.js](https://raw.githubusercontent.com/second-state/buidl/master/demo/uniswap/create_an_exchange.js) files into the BUIDL IDE and follow the instructions.



