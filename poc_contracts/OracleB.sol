// SPDX-License-Identifier: Apache-2.0

pragma solidity 0.8.4;
pragma abicoder v2;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ConsumerInterface} from "./interfaces/ConsumerInterface";
import {IBridge} from "./interfaces/IBridge.sol";
import {Obi} from "./libraries/Obi.sol";
import {OracleBDecoder} from "./libraries/OracleBDecoder.sol";


contract OracleB is Ownable {
    using Obi for Obi.Data;

    /// Contract's global variables
    IBridge public bridge;
    uint64 public oracleScriptID;
    uint64 public ansCount;
    uint16 public thisChainId;
    uint256 public minimumConfirmations;

    /// @notice OracleB constructor
    constructor(
        IBridge _bridge,
        uint64 _oracleScriptID,
        uint64 _ansCount,
        uint16 _thisChainId,
        uint256 _minimumConfirmations
    ) {
        bridge = _bridge;
        oracleScriptID = _oracleScriptID;
        ansCount = _ansCount;
        thisChainId = _thisChainId;
        minimumConfirmations = _minimumConfirmations;
    }

    function updateVariables(
        IBridge _bridge,
        uint64 _oracleScriptID,
        uint64 _ansCount,
        uint16 _thisChainId,
        uint256 _minimumConfirmations
    ) external onlyOwner {
        bridge = _bridge;
        oracleScriptID = _oracleScriptID;
        ansCount = _ansCount;
        thisChainId = _thisChainId;
        minimumConfirmations = _minimumConfirmations;
    }

    function relayBlock(bytes memory proof) external {
        // Verify input proof using the bridge contract's relayAndVerify method
        IBridge.Result memory res = bridge.relayAndVerify(proof);

        // Decode the returned request's input parameters and response parameters
        OracleBDecoder.Params memory params = OracleBDecoder.decodeParams(
            res.params
        );
        OracleBDecoder.Result memory result = OracleBDecoder.decodeResult(
            res.result
        );

        /// Security checking
        require(
            res.resolveStatus == IBridge.ResolveStatus.RESOLVE_STATUS_SUCCESS,
            "FAIL_REQUEST_IS_NOT_SUCCESSFULLY_RESOLVED"
        );
        require(
            res.oracleScriptID == oracleScriptID,
            "FAIL_INCORRECT_OS_ID"
        );
        require(
            res.ansCount >= ansCount,
            "FAIL_TOO_SMALL_ANS_COUNT"
        );

        /// Result checking
        require(params.chainId == thisChainId, "FAIL_INCORRECT_CHAIN_ID");
        require(result.confirmations >= minimumConfirmations, "FAIL_TOO_SMALL_CONFIRMATIONS");

        /// Call updateBlockHeader
        ConsumerInterface(params.contractAddress).updateBlockHeader(
            result.remoteChainId,
            address(this),
            result.blockHash,
            result.confirmations,
            result.receiptsRoot
        );
    }
}
