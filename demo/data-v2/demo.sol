pragma solidity >= 0.4 .0 < 0.6 .0;

contract TextAndNumbers {
    string text;
    uint number;

    function setText(string _text) public {
        text = _text;
    }

    function setNumber(uint _number) public {
        number = _number;
    }

    function getText() public view returns(string) {
        return text;
    }

    function getNumber() public view returns(uint) {
        return number;
    }
}
