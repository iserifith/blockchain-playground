// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

/// @title IChatroomEngine
/// @author 0xeri.eth@gmail.com
interface IChatroomEngine {
    // new chatroom created
    event NewChatroom(address addr);

    // create new chatroom
    function create() external payable;

    //  get all chatrooms created
    function getAllChatrooms() external returns (address[] memory);
}
