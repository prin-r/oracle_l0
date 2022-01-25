pragma solidity 0.8.4;
pragma experimental ABIEncoderV2;

import {OracleInterface} from "./interfaces/OracleInterface.sol";

contract OracleA is OracleInterface {
    event NotifyContractOfBlock(
        uint16 chainId,
        address contractAddress,
        uint256 blockConfirmations
    );

    function notifyContractOfBlock(
        uint16 chainId,
        address contractAddress,
        uint256 blockConfirmations
    ) external override {
        emit NotifyContractOfBlock(chainId, contractAddress, blockConfirmations);
    }
}
