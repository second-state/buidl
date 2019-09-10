pragma solidity >=0.4.0<0.6.0;

// Smart contract used for testing the response behaviour of smart contract search engine
contract ParentContract {
    // Set data to 1
    uint parentContractData = 1;
    // Public View function to read data
    function getParentContractData() public view returns(uint) {
        return parentContractData;
    }
    // Public function to increment data by 1
    function incrementParentContractData() public {
        parentContractData = parentContractData + 1;
    }
    // Public function to decrement data by 1
    function decrementParentContractData() public {
        parentContractData = parentContractData - 1;
    }
}

contract ChildContract is ParentContract {
    // Set data to 1
    uint childContractData = 1;
    // Public View function to read data
    function getChildContractData() public view returns(uint) {
        return childContractData;
    }
    // Public function to increment data by 1
    function incrementChildContractData() public {
        childContractData = childContractData + 1;
    }
    // Public function to decrement data by 1
    function decrementChildContractData() public {
        childContractData = childContractData - 1;
    }
}

// Please note:
// Whole contract has an ABI hash of 0xfff42d5688beb1a00c28d1418ae7f160176ffd4dd0c5980e1cc3850b76e27b5a
// The inner ParentContract, alone, has an ABI hash of 0x29f9c761286d7d0857f6141ce739ac694aa0ba94740c172a49a16e507020d9bc
