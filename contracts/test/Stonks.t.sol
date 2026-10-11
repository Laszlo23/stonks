// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {Desk} from "../src/Desk.sol";
import {MockUsdg} from "../src/MockUsdg.sol";
import {Pit} from "../src/Pit.sol";
import {Showroom} from "../src/Showroom.sol";
import {Stonk} from "../src/Stonk.sol";

contract StonksTest is Test {
    Stonk internal stonk;
    MockUsdg internal usdg;
    Desk internal desk;
    Pit internal pit;
    Showroom internal showroom;

    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");

    function setUp() public {
        stonk = new Stonk();
        usdg = new MockUsdg();
        desk = new Desk(usdg, stonk);
        pit = new Pit(desk, usdg, stonk);
        showroom = new Showroom(desk, usdg);
        desk.setFloor(address(pit), address(showroom));
        stonk.setMinter(address(pit));
    }

    function test_feeGrowthReturnsALargerBag() public {
        uint256 id = _stock(alice, 1_000 ether, 1_000 ether);
        uint256 beforeK = 1_000 ether * 1_000 ether;

        vm.prank(alice);
        pit.openShift(id);

        vm.startPrank(bob);
        usdg.faucet();
        usdg.approve(address(pit), type(uint256).max);
        pit.swap(true, 100 ether, 0);
        vm.stopPrank();

        uint256 kInPool = pit.reserveUsdg() * pit.reserveStonk();
        assertGt(kInPool, beforeK);
        assertEq(usdg.balanceOf(address(pit)), pit.reserveUsdg());
        assertEq(stonk.balanceOf(address(pit)), pit.reserveStonk());

        vm.prank(alice);
        pit.closeShift(id);

        (uint256 bagUsdg, uint256 bagStonk) = desk.bagOf(id);
        assertGt(bagUsdg * bagStonk, beforeK);
        assertEq(uint8(desk.statusOf(id)), uint8(Desk.Status.Idle));
        assertEq(desk.ownerOf(id), alice);
    }

    function test_claimPaysAccruedStonk() public {
        uint256 id = _stock(alice, 500 ether, 500 ether);
        vm.prank(alice);
        pit.openShift(id);

        vm.warp(block.timestamp + 1 days);
        uint256 beforeBal = stonk.balanceOf(alice);

        vm.prank(alice);
        pit.claim(id);

        assertApproxEqAbs(stonk.balanceOf(alice) - beforeBal, 1 days * 1 ether, 1_000);
    }

    function test_listedDeskCannotMoveTokens() public {
        uint256 id = _stock(alice, 100 ether, 100 ether);
        vm.prank(alice);
        showroom.list(id, 25 ether);

        vm.prank(alice);
        vm.expectRevert(Desk.NotIdle.selector);
        desk.withdraw(id, 1 ether, 1 ether);

        vm.prank(alice);
        vm.expectRevert(Desk.NotIdle.selector);
        desk.transferFrom(alice, bob, id);

        (uint256 bagUsdg, uint256 bagStonk) = desk.bagOf(id);
        assertEq(bagUsdg, 100 ether);
        assertEq(bagStonk, 100 ether);
    }

    function test_buyerReceivesTheSameBag() public {
        uint256 id = _stock(alice, 100 ether, 80 ether);
        vm.prank(alice);
        showroom.list(id, 40 ether);

        vm.startPrank(bob);
        usdg.faucet();
        usdg.approve(address(showroom), type(uint256).max);
        showroom.buy(id);
        vm.stopPrank();

        assertEq(desk.ownerOf(id), bob);
        assertEq(uint8(desk.statusOf(id)), uint8(Desk.Status.Idle));
        (uint256 bagUsdg, uint256 bagStonk) = desk.bagOf(id);
        assertEq(bagUsdg, 100 ether);
        assertEq(bagStonk, 80 ether);
        assertEq(usdg.balanceOf(alice), 10_000 ether - 100 ether + 40 ether);
    }

    function test_stakedDeskCannotBeListed() public {
        uint256 id = _stock(alice, 100 ether, 100 ether);
        vm.prank(alice);
        pit.openShift(id);

        vm.prank(alice);
        vm.expectRevert(Desk.NotIdle.selector);
        showroom.list(id, 1 ether);
    }

    function test_slippageReverts() public {
        uint256 id = _stock(alice, 100 ether, 100 ether);
        vm.prank(alice);
        pit.openShift(id);

        vm.startPrank(bob);
        usdg.faucet();
        usdg.approve(address(pit), type(uint256).max);
        vm.expectRevert(Pit.Slippage.selector);
        pit.swap(true, 10 ether, type(uint256).max);
        vm.stopPrank();
    }

    function _stock(address player, uint256 usdgAmt, uint256 stonkAmt) internal returns (uint256 id) {
        vm.startPrank(player);
        usdg.faucet();
        stonk.faucet();
        usdg.approve(address(desk), type(uint256).max);
        stonk.approve(address(desk), type(uint256).max);
        id = desk.mint();
        desk.deposit(id, usdgAmt, stonkAmt);
        vm.stopPrank();
    }
}
