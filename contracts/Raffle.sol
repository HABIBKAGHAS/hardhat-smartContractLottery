// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

error Raffle__NotEnoughEthEntered();

contract Raffle {
    uint256 immutable i_enteranceFee;
    address payable[] private s_players;

    event RaffleEnter(address indexed player);

    constructor(uint256 enteranceFee) {
        i_enteranceFee = enteranceFee;
    }

    function enterRaffle() public payable {
        if (msg.value < i_enteranceFee) {
            revert Raffle__NotEnoughEthEntered();
        }

        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    function getEnteranceFee() public returns (uint256) {
        return i_enteranceFee;
    }

    function getPlayer(uint256 index) public returns (address) {
        return s_players[index];
    }
}
