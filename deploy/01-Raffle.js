const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../helper-hardhat-config");

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30");
module.exports.default = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    let vrfCoordinatorV2Address, subscriptionId;
    const chainId = network.config.chainId;
    let gasLimit;
    let interval;

    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = await VRFCoordinatorV2Mock.address;
        const transactionResponse = await VRFCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        subscriptionId = transactionReceipt.events[0].args.subId;
        gasLimit = networkConfig[chainId].gasLimit;
        interval = networkConfig[chainId].interval;

        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT);
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2Address;
        subscriptionId = networkConfig[chainId].subscriptionId;
        gasLimit = networkConfig[chainId].gasLimit;
        interval = networkConfig[chainId].interval;
    }

    const enteranceFee = networkConfig[chainId].enteranceFee;
    const gasLane = networkConfig[chainId].gasLane;

    const Raffle = await deploy("Raffle", {
        from: deployer,
        log: true,
        args: [vrfCoordinatorV2Address, enteranceFee, gasLane, subscriptionId, gasLimit, interval],
        blockConfirmations: network.config.blockConfirmations || 1,
    });

    if (!developmentChains.includes(network.name)) {
        await verify(Raffle.address, [
            vrfCoordinatorV2Address,
            enteranceFee,
            subscriptionId,
            gasLimit,
            interval,
        ]);
    }

    log("-----------------------------------------------------");
};

module.exports.tags = ["all", "Raffle"];
