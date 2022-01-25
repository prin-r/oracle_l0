pragma solidity 0.8.4;
pragma experimental ABIEncoderV2;

import {OracleInterface} from "./interfaces/OracleInterface.sol";

contract ContractA {
    OracleInterface public oracle;

    constructor(OracleInterface _oracle) {
        oracle = _oracle;
    }

    function requestToOracle(uint16 chainId, address contractAddress, uint256 blockConfirmations) public {
        oracle.notifyContractOfBlock(chainId, contractAddress, blockConfirmations);
    }
}
