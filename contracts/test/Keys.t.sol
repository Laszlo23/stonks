// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {Desk} from "../src/Desk.sol";
import {Keys} from "../src/Keys.sol";
import {MockUsdg} from "../src/MockUsdg.sol";
import {Pit} from "../src/Pit.sol";
import {Showroom} from "../src/Showroom.sol";
import {Stonk} from "../src/Stonk.sol";

contract KeysTest is Test {
    Stonk internal stonk;
    MockUsdg internal usdg;
    Desk internal desk;
    Keys internal keys;

    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");

    function setUp() public {
        stonk = new Stonk();
        usdg = new MockUsdg();
        desk = new Desk(usdg, stonk);
        Pit pit = new Pit(desk, usdg, stonk);
        Showroom showroom = new Showroom(desk, usdg);
        desk.setFloor(address(pit), address(showroom));
        keys = new Keys(usdg, desk);

        vm.prank(alice);
        desk.mint();
    }

    function test_firstPassCostsTenAndTheCoverWaits() public {
        vm.startPrank(bob);
        usdg.faucet();
        usdg.approve(address(keys), type(uint256).max);
        keys.buy(1, 1);
        vm.stopPrank();

        assertEq(keys.balanceOf(1, bob), 1);
        assertEq(keys.supplyOf(1), 1);
        assertEq(keys.tillOf(1), 0.2 ether);
        assertEq(usdg.balanceOf(address(keys)), 10.2 ether);
        assertEq(usdg.balanceOf(bob), 10_000 ether - 10.2 ether);
    }

    function test_theNextPassStepsUp() public {
        _buy(bob, 1);
        (uint256 pay, uint256 fee) = keys.quoteBuy(1, 1);
        assertEq(pay, 15.3 ether);
        assertEq(fee, 0.3 ether);
    }

    function test_sellingReturnsTheStepMinusTheCover() public {
        _buy(bob, 1);
        uint256 before = usdg.balanceOf(bob);
        vm.prank(bob);
        keys.sell(1, 1);
        assertEq(keys.balanceOf(1, bob), 0);
        assertEq(keys.supplyOf(1), 0);
        assertEq(usdg.balanceOf(bob) - before, 9.8 ether);
        assertEq(keys.tillOf(1), 0.4 ether);
    }

    function test_holdingEarnsNothing() public {
        _buy(bob, 1);
        vm.warp(block.timestamp + 7 days);
        assertEq(keys.balanceOf(1, bob), 1);
        assertEq(keys.tillOf(1), 0.2 ether);
    }

    function test_theDeskOwnerDrawsTheCover() public {
        _buy(bob, 1);
        vm.prank(alice);
        keys.draw(1);
        assertEq(usdg.balanceOf(alice), 0.2 ether);
        assertEq(keys.tillOf(1), 0);
    }

    function test_aMissingDeskReverts() public {
        vm.expectRevert(Keys.BadId.selector);
        keys.quoteBuy(9, 1);
    }

    function test_cannotSellAPassYouDoNotHold() public {
        _buy(bob, 1);
        vm.prank(alice);
        vm.expectRevert(Keys.NoneHeld.selector);
        keys.sell(1, 1);
    }

    function _buy(address who, uint256 amount) internal {
        vm.startPrank(who);
        usdg.faucet();
        usdg.approve(address(keys), type(uint256).max);
        keys.buy(1, amount);
        vm.stopPrank();
    }
}
