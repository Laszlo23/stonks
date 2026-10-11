// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Token} from "./Token.sol";

/// @notice Game token. The pit mints emissions. Fees are not paid in new STONK.
contract Stonk is Token {
    constructor() Token("Stonk", "STONK") {}
}
