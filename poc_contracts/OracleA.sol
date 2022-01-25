pragma solidity 0.8.4;
pragma experimental ABIEncoderV2;

contract OracleA {
    event NotifyContractOfBlock(
        uint16 chainId,
        address contractAddress,
        uint256 blockConfirmations
    );

    function notifyContractOfBlock(
        uint16 chainId,
        address contractAddress,
        uint256 blockConfirmations
    ) external {
        emit NotifyContractOfBlock(chainId, contractAddress, blockConfirmations);
    }
}
