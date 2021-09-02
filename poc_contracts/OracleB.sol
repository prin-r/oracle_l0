pragma solidity 0.8.4;
pragma experimental ABIEncoderV2;

import {ConsumerInterface} from "./interfaces/ConsumerInterface";
import {IBridge} from "./interfaces/IBridge.sol";

contract OracleB {
    using Obi for Obi.Data;
    IBridge public immutable _bridge;

    /// @notice BandVRF constructor
    /// @param bridge The address of Band's Bridge contract
    constructor(IBridge bridge) {
        _bridge = bridge;
    }

    function relayBlock(bytes memory proof) external {
        // Verify input proof using the bridge contract's relayAndVerify method
        IBridge.Result memory res = _bridge.relayAndVerify(proof);

        // Decode the returned request's input parameters and response parameters
        OracleDecoder.Params memory params = OracleDecoder.decodeParams(
            res.params
        );
        OracleDecoder.Result memory result = OracleDecoder.decodeResult(
            res.result
        );

        ConsumerInterface consumer = ConsumerInterface(params.contractAddress);
        consumer.updateBlock(
            result.chainID,
            result.blockHash,
            result.receiptsRoot
        );
    }
}
