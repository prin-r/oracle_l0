const Web3 = require("web3");
require("dotenv").config();
const { sendRequest, relayToTargetChain } = require("./requestData.js");

// variables
const kovanWeb3 = new Web3(process.env.ETH_RPC);
const startBlock = Number(process.env.START_ETH_BLOCK);
let currentBlock = startBlock;
let pendingTxs = []; // [{targetBlock, remoteChainID, minimumConfirmations, contractAddress, txHash}]

// a utility function for pausing the main loop
const sleep = async (ms) => new Promise((r) => setTimeout(r, ms));

// subscribe new events
kovanWeb3.eth.subscribe("logs", {
  fromBlock: startBlock,
  address: [process.env.CONTRACT_ORACLE_A],
  topics: [],
}).on("data", (event, error) => {
  if (error) {
    console.error("logSubscription error: ", error);
  }

  if (!error && event) {
    console.log("EVENT FOUND: ", event);
    params = kovanWeb3.eth.abi.decodeParameters(
      ["uint16", "address", "uint256"],
      event.data
    );
    const minimumConfirmations = parseInt(params[2]);
    pendingTxs.push({
      targetBlock: parseInt(event.blockNumber) + minimumConfirmations,
      remoteChainID: params[0],
      minimumConfirmations,
      contractAddress: params[1],
      txHash: event.transactionHash,
    });
    pendingTxs.sort((a,b) => a.targetBlock < b.targetBlock ? -1:1)
    console.log(`Added pending tx`);
  }
});

// subscribe new blocks
kovanWeb3.eth.subscribe("newBlockHeaders").on("data", (block, error) => {
  if (error) {
    console.error("blockSubsciption error: ", error);
  }

  console.log("block number: ", block.number)

  if (!error && block.number && block.number !== 0) {
    currentBlock = block.number;
    console.log(
      "pending Txs",
      pendingTxs.map(({ targetBlock }) => ({ targetBlock }))
    );
  }
});

// main loop
(async () => {
  while (true) {
      if (pendingTxs.length > 0 && currentBlock >= pendingTxs[0].targetBlock) {
        // pop the tx
        const tx = pendingTxs.shift();

        // send a request to Bandchain
        const proof = await sendRequest(
            1, // ETH (origin chain)
            tx
        );

        // relay proof to target chain
        await relayToTargetChain(proof);
      }

      await sleep(1000);
  }
})();
