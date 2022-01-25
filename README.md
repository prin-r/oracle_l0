# L0 Preparation

This POC project consists of several parts wherein the end it is possible to securely transmit `blockHash, receiptsRoot` of Kovan testnet to BSC testnet using the services of Band oracle.

## Outline

- [Flow](#Flow)
- [Contracts](#Contracts)
- [Datasource](#Datasource)
- [Oraclescript](#Oraclescript)
- [BlockWatcher](#BlockWatcher)

## Flow

The steps in this flow demonstrate the sequence of transmission of block data starting from the user interacting with ContractA on Kovan testnet until the block data appears in the ContractB on BSC testnet.

![img](https://user-images.githubusercontent.com/12705423/131868544-8e1678d3-acc2-4fc1-a2a3-1c8dc62d2363.png)

Video Demo:

[![img](https://user-images.githubusercontent.com/12705423/131883015-27f3f602-3569-465f-9542-fa586e1ed79d.png)](https://www.youtube.com/watch?v=I3ho5ezB8mI)

## Contracts

- [ContractA](./poc_contracts/ContractA.sol)
- [OracleA](./poc_contracts/OracleA.sol)
- [ContractB](./poc_contracts/ContractB.sol)
- [OracleB](./poc_contracts/OracleB.sol)
- [Bridge](https://github.com/prin-r/bridge-sol-08/blob/master/contracts/bridge/Bridge.sol)

#### Deployed

Kovan Testnet

| Name      | Address                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| ContractA | [0x3d1dcaf6706f169d8c5aae59871d05c0433886f3](https://kovan.etherscan.io/address/0x3d1dcaf6706f169d8c5aae59871d05c0433886f3#code) |
| OracleA   | [0xfaeafd3b76eecaec1b572f3a59ec1c030f2e683f](https://kovan.etherscan.io/address/0xfaeafd3b76eecaec1b572f3a59ec1c030f2e683f#code) |

BSC Testnet

| Name      | Address                                                                                                                           |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| ContractB | [0xCB1144534876A10CF3556b28E9E9101e44cbf215](https://testnet.bscscan.com/address/0xCB1144534876A10CF3556b28E9E9101e44cbf215#code) |
| OracleB   | [0x6A610498dAd9D0F5076F2eBD08F2Fd26642E81ac](https://testnet.bscscan.com/address/0x6A610498dAd9D0F5076F2eBD08F2Fd26642E81ac#code) |
| Bridge    | [0xfdBBAD9D6A4e85a38c12ca387014bd5F697f0661](https://testnet.bscscan.com/address/0xfdBBAD9D6A4e85a38c12ca387014bd5F697f0661#code) |

## Datasource

[⛓️ See deployed datasource on Bandchain testnet4](https://laozi-testnet4.cosmoscan.io/data-source/238#code)

[📁 See datasource folder](./datasource)

## Oraclescript

[⛓️ See deployed oracle script on Bandchain testnet4](https://laozi-testnet4.cosmoscan.io/oracle-script/113)

[📁 See oracle script folder](./oracle_script)

## Block Watcher

[📁 See block watcher folder](./block_watcher)
