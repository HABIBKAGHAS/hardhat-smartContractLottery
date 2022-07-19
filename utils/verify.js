const { run } = require("hardhat");

async function verify(contractAddress, args) {
  console.log("Verifying contract...");

  try {
    await simpleStorage.deployTransaction.wait(1);
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    if (error.message.includes("already verified")) {
      console.log("already verified");
    }
  }
}

module.exports = { verify };
