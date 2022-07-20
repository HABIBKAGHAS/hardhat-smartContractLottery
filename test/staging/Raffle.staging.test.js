const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", () => {
          let raffle, raffleEntranceFee, deployer;
          const chainId = network.config.chainId;
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              raffle = await ethers.getContract("Raffle", deployer);
              raffleEntranceFee = await raffle.getEnteranceFee();
          });

          describe("fulfillRandomWords", function () {
              beforeEach(async function () {
                  deployer = (await getNamedAccounts()).deployer;
                  raffle = await ethers.getContract("Raffle", deployer);
                  raffleEntranceFee = await raffle.getEnteranceFee();
              });

              it("works with live chainLink keepers and chainlink vrf, we get a random winner", async () => {
                  const startingTimeStamp = await raffle.getLatestTimestamp();
                  const accounts = await ethers.getSigners();
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("winner has been picked");
                          try {
                              //assert
                              const recentWinner = await raffle.getRecentWinner();
                              const raffleState = await raffle.getRaffleState();
                              const winnerEndingBalance = await accounts[0].getBalance();
                              const endingTimeStamp = await raffle.getLatestTimestamp();

                              await expect(raffle.getPlayer(0)).to.be.reverted;
                              assert.equal(recentWinner.toString(), accounts[0].address);
                              assert.equal(raffleState, 0);
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerSatartingBalance.add(raffleEntranceFee).toString()
                              );
                              assert(endingTimeStamp > startingTimeStamp);
                          } catch (error) {
                              reject(error);
                          }

                          resolve();
                      });
                  });

                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  const winnerSatartingBalance = await accounts[0].getBalance();
              });
          });
      });
