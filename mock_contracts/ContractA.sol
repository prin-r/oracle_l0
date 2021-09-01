pragma solidity 0.8.4;
pragma experimental ABIEncoderV2;

interface OracleInterface {
    function notifyContractOfBlock(
        uint16 chain,
        address contractAddress,
        uint256 blockConfirmations
    ) external;
}

contract ContractA {
    OracleInterface public oracle;

    constructor(OracleInterface _oracle) {
        oracle = _oracle;
    }

    function requestToOracle(
        uint16 chain,
        address contractAddress,
        uint256 blockConfirmations
    ) public {
        oracle.notifyContractOfBlock(
            chain,
            contractAddress,
            blockConfirmations
        );
    }
}
