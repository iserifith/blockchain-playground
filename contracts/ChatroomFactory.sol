// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./IChatroomFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ChatroomFactory
/// @author 0xeri.eth@gmail.com
contract ChatroomFactory is IChatroomFactory, Ownable {
    mapping(address => ParticipantStruct) public participantList;
    MessageStruct[] private messages;

    constructor(address _caller) {
        initialize(_caller);
    }

    function initialize(address _caller) private {
        _transferOwnership(_caller);
        participantList[_caller] = ParticipantStruct(
            _caller,
            "owner",
            block.timestamp
        );
    }

    function checkIsParticipant(address _addr) public view returns (bool) {
        return participantList[_addr].addr == _addr;
    }

    function addParticipant(address _addr, string calldata _identifier)
        public
        onlyOwner
    {
        require(checkIsParticipant(_addr) == false, "Address is participant");
        ParticipantStruct memory p = ParticipantStruct(
            _addr,
            _identifier,
            block.timestamp
        );
        emit NewParticipantAdded(p);
        participantList[_addr] = p;
    }

    function sendMessage(string calldata _msg) external {
        require(checkIsParticipant(msg.sender), "Not a participant");
        ParticipantStruct memory p = participantList[msg.sender];
        MessageStruct memory newMsg = MessageStruct(p, block.timestamp, _msg);
        emit NewMessage(newMsg);
        messages.push(newMsg);
    }

    function getAllMessages() external view returns (MessageStruct[] memory) {
        return messages;
    }
}
