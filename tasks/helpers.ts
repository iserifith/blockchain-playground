// const path = require("path");
// const fs = require("fs");

import fs from "fs";
import path from "path";

export const abiBasePath = path.resolve(__dirname, "../artifacts/contracts");
export const generatedBasePath = path.resolve(__dirname, "../generated");

export const getAbi = async (folder: string, file: string) => {
  try {
    const result = fs.readFileSync(
      path.resolve(abiBasePath, `${folder}.sol/${file}.json`),
      "utf-8"
    );
    return JSON.parse(result).abi;
  } catch (error) {
    console.log(error);
    process.exitCode = 1;
  }
};

export const generateDeploymentFile = async (name: string, data: any) => {
  fs.writeFileSync(
    path.resolve(generatedBasePath, `${name}.json`),
    JSON.stringify(data)
  );
};
