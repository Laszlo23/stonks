// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {Desk} from "../src/Desk.sol";
import {Keys} from "../src/Keys.sol";
import {Token} from "../src/Token.sol";

/// @notice Seats the pass on an existing practice table. Does not touch the desks.
contract DeployKeys is Script {
    uint256 internal constant PK_A = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    function run() external {
        Token usdg = Token(vm.envAddress("USDG"));
        Desk desk = Desk(vm.envAddress("DESK"));
        vm.startBroadcast(PK_A);
        Keys keys = new Keys(usdg, desk);
        vm.stopBroadcast();
        console.log("keys", address(keys));
    }
}
