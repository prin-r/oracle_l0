# L0 Oracle POC

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
| ContractB | [0xdcfa1244c37262441aa7caf9893fdd99db101e2a](https://testnet.bscscan.com/address/0xdcfa1244c37262441aa7caf9893fdd99db101e2a#code) |
| OracleB   | [0x16665448a08f68d82215ccfdcef88a9ba1589ae7](https://testnet.bscscan.com/address/0x16665448a08f68d82215ccfdcef88a9ba1589ae7#code) |
| Bridge    | [0xf694a2a7421efdb441bf63b2ef3864e4eddfb42e](https://testnet.bscscan.com/address/0xf694a2a7421efdb441bf63b2ef3864e4eddfb42e#code) |

## Datasource

[⛓️ See deployed datasource on Bandchain testnet3](https://laozi-testnet3.cosmoscan.io/data-source/95)

[📁 See datasource folder](./datasource)

## Oraclescript

[⛓️ See deployed oracle script on Bandchain testnet3](https://laozi-testnet3.cosmoscan.io/oracle-script/58)

[📁 See oracle script folder](./oracle_script)

## Block Watcher

[📁 See block watcher folder](./block_watcher)
