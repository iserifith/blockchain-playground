require("@nomicfoundation/hardhat-toolbox");
import { task } from "hardhat/config";

const { getAbi, generateDeploymentFile } = require("./helpers");

task("deploy_1", "Deploy ChatroomEngine", async function (args, hre, runSuper) {
  const name = "ChatroomEngine";
  const ChatroomEngine = await hre.ethers.getContractFactory(name);
  const ce = await ChatroomEngine.deploy();
  const contractAddr = ce.address;
  const txHash = ce.deployTransaction.hash;

  console.log({
    contractAddr,
    txHash,
  });

  await ce.deployTransaction.wait(6);
  const ChatroomEngineAbi = await getAbi(name, name);
  const ChatroomFactoryAbi = await getAbi("ChatroomFactory", "ChatroomFactory");
  const data = {
    contractAddr,
    ChatroomEngineAbi,
    ChatroomFactoryAbi,
  };
  await generateDeploymentFile(name, data);
  await hre.run("verify:verify", {
    address: contractAddr,
  });
});
