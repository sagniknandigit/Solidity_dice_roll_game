// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DiceRollGame {
    address public owner;
    uint256 public minBet;
    uint256 public maxBet;
    uint256 public houseEdge; // In percentage (e.g., 5 means 5%)

    event DiceRolled(address indexed player, uint8 diceOutcome, uint256 betAmount, bool win);
    event FundsDeposited(address indexed depositor, uint256 amount);
    event FundsWithdrawn(address indexed withdrawer, uint256 amount);

    constructor(uint256 _minBet, uint256 _maxBet, uint256 _houseEdge) {
        owner = msg.sender;
        minBet = _minBet;
        maxBet = _maxBet;
        houseEdge = _houseEdge;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function depositFunds() external payable onlyOwner {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        emit FundsDeposited(msg.sender, msg.value);
    }

    function withdrawFunds(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance in contract");
        payable(owner).transfer(amount);
        emit FundsWithdrawn(msg.sender, amount);
    }

    function rollDice(uint8 guess) external payable {
        require(msg.value >= minBet && msg.value <= maxBet, "Bet amount out of range");
        require(guess >= 1 && guess <= 6, "Guess must be between 1 and 6");

        uint8 diceOutcome = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.prevrandao))) % 6) + 1;
        bool win = (guess == diceOutcome);

        if (win) {
            uint256 payout = (msg.value * (100 - houseEdge)) / 10;
            require(address(this).balance >= payout, "Insufficient contract balance for payout");
            payable(msg.sender).transfer(payout);
        }

        emit DiceRolled(msg.sender, diceOutcome, msg.value, win);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
