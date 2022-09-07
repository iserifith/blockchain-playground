// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./IChatroomEngine.sol";
import "./ChatroomFactory.sol";

/// @title ChatroomEngine
/// @author 0xeri.eth@gmail.com
contract ChatroomEngine is IChatroomEngine {
    address[] private chatrooms;
    uint256 public cost = 0.0001 ether;

    function create() external payable {
        require(cost == msg.value, "Cost to create chatroom not met.");
        ChatroomFactory chatroom = new ChatroomFactory(msg.sender);
        chatrooms.push(address(chatroom));
        emit NewChatroom(address(chatroom));
    }

    function getAllChatrooms() public view returns (address[] memory) {
        return chatrooms;
    }
}
