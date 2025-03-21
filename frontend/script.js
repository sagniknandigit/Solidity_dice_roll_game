const contractAddress = "0xbCb7BC306e41A0AD33cbEb71368A61eA424Ab2F7";
const abi = [
    [
        {
            "inputs": [],
            "name": "depositFunds",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_minBet",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_maxBet",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_houseEdge",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "player",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint8",
                    "name": "diceOutcome",
                    "type": "uint8"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "betAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "win",
                    "type": "bool"
                }
            ],
            "name": "DiceRolled",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "depositor",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "FundsDeposited",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "withdrawer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "FundsWithdrawn",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint8",
                    "name": "guess",
                    "type": "uint8"
                }
            ],
            "name": "rollDice",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "withdrawFunds",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getContractBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "houseEdge",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "maxBet",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "minBet",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
];

let web3;
let contract;
let account;

document.getElementById("connectWallet").addEventListener("click", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        contract = new web3.eth.Contract(abi, contractAddress);
        alert(`Connected: ${account}`);
    } else {
        alert("Please install MetaMask!");
    }
});

document.getElementById("rollDice").addEventListener("click", async () => {
    if (!account) {
        alert("Connect your wallet first!");
        return;
    }

    const betAmount = document.getElementById("betAmount").value;
    if (betAmount <= 0) {
        alert("Enter a valid bet amount.");
        return;
    }

    try {
        const result = await contract.methods.rollDice().send({
            from: account,
            value: web3.utils.toWei(betAmount, "ether"),
        });

        alert("Dice rolled! Check transaction.");
        console.log(result);
    } catch (error) {
        console.error(error);
        alert("Transaction failed.");
    }
});
