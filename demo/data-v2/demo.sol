pragma solidity >= 0.4.0 < 0.6.0;

contract AccountBalanceDemo {

    string accountName;
    uint accountBalance;

    constructor(string _accountName) public {
        accountName = _accountName;
    }

    function setAccountBalance(uint _accountBalance) public {
        accountBalance = _accountBalance;
    }

    function getAccountName() public view returns(string) {
        return accountName;
    }

    function getAccountBalance() public view returns(uint) {
        return accountBalance;
    }
}
