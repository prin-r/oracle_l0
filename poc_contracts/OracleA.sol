pragma solidity 0.8.4;
pragma experimental ABIEncoderV2;

contract OracleA {
    event NotifyContractOfBlock(
        uint16 chain,
        address contractAddress,
        uint256 blockConfirmations
    );

    function notifyContractOfBlock(
        uint16 chain,
        address contractAddress,
        uint256 blockConfirmations
    ) external {
        emit NotifyContractOfBlock(chain, contractAddress, blockConfirmations);
    }
}
