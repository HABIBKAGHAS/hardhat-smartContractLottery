const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
module.exports.default = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    const BASE_FEE = ethers.utils.parseEther("0.25");
    const GAS_PRICE_LINK = 1e9;

    if (developmentChains.includes(network.name)) {
        log("Deploying Mocks....");
        const Raffle = await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: [BASE_FEE, GAS_PRICE_LINK],
            log: true,
            blockConfirmations: network.config.blockConfirmations || 1,
        });
        log("Mock deployed");
        log("-----------------------------------------------------");
    }
};

module.exports.tags = ["all", "fundme"];
