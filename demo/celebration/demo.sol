pragma solidity >= 0.4.0;

contract Celebration {

    string public greeting;
    mapping (address => string) likes;
    address [] addrs;

    constructor(string _greeting) public {
        greeting = _greeting;
    }

    function addLike (address _addr, string _name) public {
        likes[_addr] = _name;
        addrs.push(_addr);
    }

    function getLikeName(address _addr) public view returns(string) {
        return likes[_addr];
    }

    function getAddrs () public view returns (address []) {
        return addrs;
    }
}
