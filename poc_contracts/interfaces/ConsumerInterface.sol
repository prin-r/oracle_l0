pragma solidity 0.8.4;

interface ConsumerInterface {
    function updateBlock(
        uint16 _chain,
        bytes32 _blockHash,
        bytes32 _receiptsRoot
    ) external;
}
