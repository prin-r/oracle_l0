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
} = require("@bandprotocol/bandchain.js");
const bscWeb3 = new Web3(process.env.BSC_RPC);

const client = new Client(process.env.BAND_RPC);
const { PrivateKey } = Wallet;
const mnemonic = process.env.BAND_REQUEST_PK;
const privateKey = PrivateKey.fromMnemonic(mnemonic);
const pubkey = privateKey.toPubkey();
const sender = pubkey.toAddress().toAccBech32();

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
        gas: Number(process.env.GAS_B),
        gasPrice: await bscWeb3.eth.getGasPrice(),
      },
      process.env.BSC_RELAYER_PK
    );
    const receipt = await bscWeb3.eth.sendSignedTransaction(
      signed.rawTransaction
    );
    console.log(receipt);
  } catch (e) {
    console.log(e);
  }
};

const sendRequest = async (chainName, tx, callback) => {
  const targetContractAddress = tx.contractAddress.slice(2);
  const blockNumber = tx.targetBlock;
  const calldata = Buffer.concat([
    Buffer.from([0, 0, 0, chainName.length]),
    Buffer.from(chainName, "utf-8"),
    Buffer.from([0, 0, 0, 20]),
    Buffer.from(targetContractAddress, "hex"),
    Buffer.from(blockNumber.toString(16).padStart(16, "0"), "hex"),
  ]);

  let coin = new Coin();
  coin.setDenom("uband");
  coin.setAmount("10");

  const requestMessage = new Message.MsgRequestData(
    58,
    calldata,
    1,
    1,
    "band",
    sender,
    [coin],
    50000,
    200000
  );

  // Construct a transaction
  const fee = new Fee();
  fee.setAmountList([coin]);
  const chainId = await client.getChainId();
  const txn = new Transaction();
  txn.withMessages(requestMessage.toAny());
  await txn.withSender(client, sender);
  txn.withChainId(chainId);
  txn.withGas(2000000);
  txn.withFee(fee);
  txn.withMemo("");

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
      // console.log(e);
    }
    await sleep(1000);
  }
  console.log("proof len", proof.length);

  await relayToTargetChain(proof);

  callback(tx.txHash);

  return sendTx;
};

module.exports = { sendRequest };
