const Web3 = require("web3");
require("dotenv").config();
const { sendRequest } = require("./requestData.js");

const kovanWeb3 = new Web3(process.env.ETH_RPC);

const startBlock = Number(process.env.START_ETH_BLOCK);

const logSubscription = kovanWeb3.eth.subscribe("logs", {
  fromBlock: startBlock,
  address: [process.env.CONTRACT_A],
  topics: [],
});
const blockSubscription = kovanWeb3.eth.subscribe("newBlockHeaders");

// state
let currentBlock = startBlock;
// pendingTx = {targetBlock, chain, contractAddress, txHash}
let pendingTxs = [];

// subscribe new event
logSubscription.on("data", (event, error) => {
  if (error) {
    console.error("logSubscription: ", error);
  }

  if (!error && event) {
    console.log(event);
    params = kovanWeb3.eth.abi.decodeParameters(
      ["uint16", "address", "uint256"],
      event.data
    );
    pendingTxs.push({
      targetBlock: parseInt(event.blockNumber) + parseInt(params[2]),
      chain: params[0],
      contractAddress: params[1],
      txHash: event.transactionHash,
    });
    console.log(`Added pending tx`);
  }
});

// subscribe new block
blockSubscription.on("data", (block, error) => {
  if (error) {
    console.error("blockSubsciption: ", error);
  }

  if (!error && block.number && block.number !== 0) {
    console.log(block.number);
    currentBlock = block.number;

    console.log(
      "pending Txs",
      pendingTxs.map(({ targetBlock }) => ({ targetBlock }))
    );
  }
});

const sleep = async (ms) => new Promise((r) => setTimeout(r, ms));

const removeTxByHash = (txHash) => {
  pendingTxs = pendingTxs.filter((tx) => tx.txHash !== txHash);
};

(async () => {
  while (true) {
    const pendingTxsClone = [...pendingTxs];
    for (let i = 0; i < pendingTxsClone.length; i++) {
      const tx = pendingTxsClone[i];
      if (currentBlock >= tx.targetBlock) {
        await sendRequest("ETH", tx, removeTxByHash);
      }
    }

    await sleep(1000);
  }
})();
