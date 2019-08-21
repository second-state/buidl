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
// Whole contract has an ABI hash of 0x225f0096508d06088d4d9259ba30506439a852e88d5fb947177b0180316aa342
// The inner ParentContract, alone, has an ABI hash of 0x0762cd5459273ec4400821158f74f8912b0d9ef353263a11f30b91f0770d7fc0
