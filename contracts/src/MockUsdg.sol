// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Token} from "./Token.sol";

/// @notice Local stand-in for USDG. Robinhood Chain uses the real token.
contract MockUsdg is Token {
    /// @dev Official USDG on Robinhood Chain. Zero until that address is confirmed.
    address public constant ROBINHOOD_USDG = address(0);
    uint256 public constant ROBINHOOD_CHAIN_ID = 4663;

    constructor() Token("USD Gilded", "USDG") {}
}
