import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "@typechain/hardhat";
import "hardhat-abi-exporter";
import "solidity-coverage";
import "hardhat-gas-reporter";
import "@nomicfoundation/hardhat-chai-matchers";
import secret from "./secret.json";

import "./tasks/ChatroomEngine.task";
import "./tasks/UniswapV3.tasks";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: secret.INFURA_URL,
      accounts: [secret.WALLET_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: secret.ETHERSCAN_API_KEY,
  },
  typechain: {
    outDir: "generated/typechain/",
    target: "ethers-v5",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
    dontOverrideCompile: false, // defaults to false
  },
  abiExporter: {
    path: "generated/abi/",
    runOnCompile: true,
    clear: true,
    flat: true,
    spacing: 4,
    pretty: true,
  },
};

export default config;
