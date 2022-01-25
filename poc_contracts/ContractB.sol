// SPDX-License-Identifier: Apache-2.0

pragma solidity 0.8.4;
pragma abicoder v2;

contract ContractB {
    address public trustedOracle;
    uint256 public nonce;
    uint16 public latestChain;
    bytes public latestBlockHashlockHash;
    uint256 public latestConfirmation;
    bytes public latestReceiptsRoot;

    constructor(address _oracle) {
        trustedOracle = _oracle;
    }

    function updateBlockHeader(
        uint16 remoteChainId,
        address oracle,
        bytes calldata blockHash,
        uint256 confirmations,
        bytes calldata receiptsRoot
    ) external {
        require(msg.sender == trustedOracle && oracle == trustedOracle, "FAIL_UNKNOWN_ORACLE");

        latestChain = remoteChainId;
        latestBlockHashlockHash = blockHash;
        latestConfirmation = confirmations;
        latestReceiptsRoot = receiptsRoot;
        nonce = nonce + 1;
    }
}