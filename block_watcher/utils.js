require("dotenv").config();
const axios = require("axios");
const Web3 = require("web3");
const {
  Client,
  Wallet,
  Message,
  Coin,
  Transaction,
  Fee,
  Obi,
} = require("@bandprotocol/bandchain.js");
const bscWeb3 = new Web3(process.env.BSC_RPC);

const client = new Client(process.env.BAND_RPC);
const { PrivateKey } = Wallet;
const mnemonic = process.env.BAND_MNEMONIC;
const privateKey = PrivateKey.fromMnemonic(mnemonic);
const pubkey = privateKey.toPubkey();
const sender = pubkey.toAddress().toAccBech32();

// a utility function for pausing the main loop
const sleep = async (ms) => new Promise((r) => setTimeout(r, ms));

const relayToTargetChain = async (proof) => {
  try {
    const signed = await bscWeb3.eth.accounts.signTransaction(
      {
        to: process.env.CONTRACT_ORACLE_B,
        data: bscWeb3.eth.abi.encodeFunctionCall(
          {
            name: "relayBlock",
            type: "function",
            inputs: [
              {
                type: "bytes",
                name: "proof",
              },
            ],
          },
          ["0x" + proof]
        ),
        value: 0,
        gas: Number(process.env.GAS_B),
        gasPrice: Number(await bscWeb3.eth.getGasPrice()),
      },
      process.env.BSC_RELAYER_PK
    );

    const receipt = await bscWeb3.eth.sendSignedTransaction(
      signed.rawTransaction
    );
    console.log("RELAY_TX: ", receipt);
  } catch (e) {
    console.log(e);
  }
};

const sendRequest = async (chain_id, tx) => {
  const obi = new Obi('{chain_id:u16,remote_chain_id:u16,contract_address:[u8],block_confirmations:u64,block_number:u64}/{remote_chain_id:u16,block_hash:[u8],confirmations:u64,receipts_root:[u8]}');
  const calldata = obi.encodeInput({
    chain_id,
    remote_chain_id: tx.remoteChainID,
    contract_address: [...Buffer.from(tx.contractAddress.slice(2),"hex")],
    block_confirmations: tx.minimumConfirmations,
    block_number: Number(tx.targetBlock)
  });

  let coin = new Coin();
  coin.setDenom("uband");
  coin.setAmount("10");

  const requestMessage = new Message.MsgRequestData(
    113,
    calldata,
    1,
    1,
    "band",
    sender,
    [coin],
    30000,
    50000
  );

  // Construct a transaction
  const fee = new Fee()
  fee.setAmountList([coin])
  fee.setGasLimit(400000)
  const chainId = await client.getChainId()
  const txn = new Transaction()
  txn.withMessages(requestMessage)
  await txn.withSender(client, sender)
  txn.withChainId(chainId)
  txn.withFee(fee)
  txn.withMemo('')

  // Sign the transaction using the private key
  const signDoc = await txn.getSignDoc(pubkey);
  const signature = privateKey.sign(signDoc);
  const txRawBytes = txn.getTxData(signature, pubkey);

  // Broadcast the transaction
  const sendTx = await client.sendTxBlockMode(txRawBytes);
  const requestID = sendTx["logsList"][0]["eventsList"]
    .find((x) => x["type"] === "request")
    ["attributesList"].find((x) => x["key"] === "id")["value"];

  console.log("requestID =", requestID);

  let proof = null;
  while (true) {
    try {
      const res = await axios.get(process.env.BAND_PROOF_ENDPOINT + requestID);
      if (res["data"]["result"]["evm_proof_bytes"].length > 0) {
        proof = res["data"]["result"]["evm_proof_bytes"];
        break;
      }
    } catch (e) {
      // pass
    }
    await sleep(1000);
  }
  console.log("proof len", proof.length);

  return proof;
};

module.exports = { sendRequest, relayToTargetChain, sleep };
