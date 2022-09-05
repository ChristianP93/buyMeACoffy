// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//Deployed in Goerly at: 0x596b0ef2c489F2f0174f41e5FB308CDE9679bf7a

// Import this file to use console.log
import "hardhat/console.sol";

contract BuyMeACoffee {
    //new Memo Event
    event NewMemo(address indexed from, uint256 timestamp, string name, string message);

    //Event structure;
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Memo[] memos; 

    address payable owner;

    constructor(){
        owner = payable (msg.sender);
    }

    /**
    * @dev buy a coffee for contract owner;
    * @param _name name of coffee buyer;
    * @param _message message from coffee buyer;
    */
    function buyCoffee(string memory _name, string memory _message) payable public {
        require(msg.value > 0, "can't buy a coffe with 0 ETH :)");
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /** 
    * @dev withdraw all balance. Just for contract owner;
    */
    function withdrawTips() public {
        require(msg.sender ==  owner, "Only owner can withdraw.");
        require(owner.send(address(this).balance)); 
    }

    /** 
    * @dev get all memos received and stored;
    */
    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }
}
