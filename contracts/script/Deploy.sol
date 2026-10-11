// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {Desk} from "../src/Desk.sol";
import {MockUsdg} from "../src/MockUsdg.sol";
import {Pit} from "../src/Pit.sol";
import {Showroom} from "../src/Showroom.sol";
import {Stonk} from "../src/Stonk.sol";

/// @notice Deploys the floor to a fresh Anvil and seats two desks.
///         Keys are Anvil's published defaults. Local only.
contract Deploy is Script {
    uint256 internal constant PK_A = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    uint256 internal constant PK_B = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d;

    function run() external {
        vm.startBroadcast(PK_A);
        Stonk stonk = new Stonk();
        MockUsdg usdg = new MockUsdg();
        Desk desk = new Desk(usdg, stonk);
        Pit pit = new Pit(desk, usdg, stonk);
        Showroom showroom = new Showroom(desk, usdg);
        desk.setFloor(address(pit), address(showroom));
        stonk.setMinter(address(pit));

        usdg.faucet();
        stonk.faucet();
        usdg.approve(address(desk), type(uint256).max);
        stonk.approve(address(desk), type(uint256).max);
        uint256 deskA = desk.mint();
        desk.deposit(deskA, 5_000 ether, 5_000 ether);
        pit.openShift(deskA);
        usdg.approve(address(pit), type(uint256).max);
        pit.swap(true, 800 ether, 0);
        vm.stopBroadcast();

        vm.startBroadcast(PK_B);
        usdg.faucet();
        stonk.faucet();
        usdg.approve(address(desk), type(uint256).max);
        stonk.approve(address(desk), type(uint256).max);
        uint256 deskB = desk.mint();
        desk.deposit(deskB, 1_000 ether, 1_000 ether);
        showroom.list(deskB, 250 ether);
        vm.stopBroadcast();

        string memory json = string.concat(
            '{"chainId":31337',
            ',"desk":"',
            vm.toString(address(desk)),
            '"',
            ',"pit":"',
            vm.toString(address(pit)),
            '"',
            ',"showroom":"',
            vm.toString(address(showroom)),
            '"',
            ',"stonk":"',
            vm.toString(address(stonk)),
            '"',
            ',"usdg":"',
            vm.toString(address(usdg)),
            '"}'
        );
        vm.writeFile("./../web/lib/addresses.json", json);

        console.log("desk A", deskA);
        console.log("desk B", deskB);
        console.log("desk", address(desk));
        console.log("pit", address(pit));
        console.log("showroom", address(showroom));
        console.log("stonk", address(stonk));
        console.log("usdg", address(usdg));
    }
}
