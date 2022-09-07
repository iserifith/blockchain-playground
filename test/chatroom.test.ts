import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import hre from "hardhat";
import {
  ChatroomEngine,
  ChatroomEngine__factory,
  ChatroomFactory,
} from "../generated/typechain";
const { ethers } = hre;

describe("Chatroom Engine Full Tests", function () {
  let owner: SignerWithAddress; // Chatroom owner
  let p1: SignerWithAddress; // Not chatroom owner acc
  let p2: SignerWithAddress; // Not chatroom owner acc
  let Engine: ChatroomEngine__factory;
  let engine: ChatroomEngine;
  let chatrooms: string[];
  let chatroom_1: ChatroomFactory;
  let chatroom_2: ChatroomFactory;
  const message = "test";

  it("Should created 2 chatrooms", async function () {
    const userAddrs = await ethers.getSigners();
    owner = userAddrs[0];
    p1 = userAddrs[1];
    p2 = userAddrs[2];
    Engine = await ethers.getContractFactory("ChatroomEngine");
    engine = await Engine.deploy();
    await engine.create({ value: ethers.utils.parseEther("0.0001") });
    await engine.create({ value: ethers.utils.parseEther("0.0001") });
    chatrooms = await engine.getAllChatrooms();
    chatroom_1 = (await ethers.getContractFactory("ChatroomFactory")).attach(
      chatrooms[0]
    );
    chatroom_2 = (await ethers.getContractFactory("ChatroomFactory")).attach(
      chatrooms[1]
    );
    expect(chatrooms.length).to.equal(2);
  });

  it("p1 is not a participant while owner is", async function () {
    expect(await chatroom_1.checkIsParticipant(p1.address)).to.be.false;
    expect(await chatroom_1.checkIsParticipant(owner.address)).to.be.true;
  });

  it("p1 is participant in chatroom_1 but not in chatroom_2", async function () {
    await chatroom_1.addParticipant(p1.address, "p1");
    expect(await chatroom_1.checkIsParticipant(p1.address)).to.be.true;
    expect(await chatroom_2.checkIsParticipant(p1.address)).to.be.false;
  });

  it("Existed participant cannot be added again", async function () {
    await expect(
      chatroom_1.addParticipant(p1.address, "p1")
    ).to.be.revertedWith("Address is participant");
  });

  it("Non-owner account should not be able to add paticipant", async function () {
    await expect(
      chatroom_1.connect(p1).addParticipant(p2.address, "p2")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Only participant can send messages.", async function () {
    expect(await chatroom_1.sendMessage(message)).to.not.be.reverted;
    expect(await chatroom_1.connect(p1).sendMessage(message)).to.not.be
      .reverted;
    await expect(
      chatroom_1.connect(p2).sendMessage(message)
    ).to.be.revertedWith("Not a participant");
  });
});
