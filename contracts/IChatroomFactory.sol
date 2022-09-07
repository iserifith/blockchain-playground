// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

/// @title IChatroomFactory
/// @author 0xeri.eth@gmail.com
interface IChatroomFactory {
    // individual participant data
    struct ParticipantStruct {
        address addr;
        string identifier;
        uint256 joined;
    }

    // message data
    struct MessageStruct {
        ParticipantStruct participant;
        uint256 timestamp;
        string msg;
    }

    // A participant added
    event NewParticipantAdded(ParticipantStruct);

    // A new message added
    event NewMessage(MessageStruct);

    // ---
    // READ
    // ---

    // check is address a participant to the chatroom
    function checkIsParticipant(address _addr) external view returns (bool);

    // returns all messages from the list
    function getAllMessages() external view returns (MessageStruct[] memory);

    // ---
    // WRITE
    // ---

    // add address to the participant list. Must be owner
    function addParticipant(address _addr, string calldata _identifier)
        external;

    // add message to the messages list. Must be participant
    function sendMessage(string calldata _msg) external;
}
