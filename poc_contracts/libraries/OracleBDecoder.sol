pragma solidity 0.8.4;
pragma abicoder v2;

import {Obi} from "./Obi.sol";

library OracleBDecoder {
    using Obi for Obi.Data;

    struct Params {
        uint16 chainId;
        address contractAddress;
        uint256 blockConfirmations;
    }

    struct Result {
        uint16 remoteChainId;
        bytes blockHash;
        uint256 confirmations;
        bytes receiptsRoot;
    }

    /// @notice Decodes the encoded request input parameters
    /// @param encodedParams Encoded paramter data
    function decodeParams(bytes memory encodedParams)
        internal
        pure
        returns (Params memory params)
    {
        Obi.Data memory decoder = Obi.from(encodedParams);
        params.chainId = decoder.decodeU16();
        params.contractAddress = decoder.decodeAddress();
        params.blockConfirmations = uint256(decoder.decodeU64());
        require(decoder.finished(), "DATA_DECODE_NOT_FINISHED");
    }

    /// @notice Decodes the encoded data request response result
    /// @param encodedResult Encoded result data
    function decodeResult(bytes memory encodedResult)
        internal
        pure
        returns (Result memory result)
    {
        Obi.Data memory decoder = Obi.from(encodedResult);
        result.remoteChainId = decoder.decodeU16();
        result.blockHash = decoder.decodeBytes();
        result.confirmations = uint256(decoder.decodeU64());
        result.receiptsRoot = decoder.decodeBytes();

        require(decoder.finished(), "DATA_DECODE_NOT_FINISHED");
    }
}
