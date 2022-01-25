pragma solidity 0.8.4;

interface ConsumerInterface {
    function updateBlockHeader(
        uint16 remoteChainId,
        address oracle,
        bytes calldata blockHash,
        uint256 confirmations,
        bytes calldata receiptsRoot
    ) external;
}
