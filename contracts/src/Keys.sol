// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Desk} from "./Desk.sol";
import {Token} from "./Token.sol";

/// @notice A pass to a desk. The price steps up by a fixed amount.
///         A 2% cover goes to the desk. Holding a pass earns nothing.
///         Passes cannot be transferred. Practice USDG only.
contract Keys {
    Token public immutable usdg;
    Desk public immutable desk;

    uint256 public constant BASE = 10 ether;
    uint256 public constant STEP = 5 ether;
    uint256 public constant FEE_BPS = 200;
    uint256 public constant MAX_AMOUNT = 20;

    mapping(uint256 => uint256) public supplyOf;
    mapping(uint256 => mapping(address => uint256)) public balanceOf;
    mapping(uint256 => uint256) public tillOf;

    event Bought(uint256 indexed id, address indexed holder, uint256 amount, uint256 pay, uint256 fee);
    event Sold(uint256 indexed id, address indexed holder, uint256 amount, uint256 back, uint256 fee);
    event Drawn(uint256 indexed id, address indexed holder, uint256 amount);

    error BadId();
    error BadAmount();
    error NoneHeld();
    error EmptyTill();
    error NotOwner();

    constructor(Token usdg_, Desk desk_) {
        usdg = usdg_;
        desk = desk_;
    }

    function quoteBuy(uint256 id, uint256 amount) external view returns (uint256 pay, uint256 fee) {
        _requireDesk(id);
        uint256 curve = _curveBuy(supplyOf[id], amount);
        fee = _fee(curve);
        pay = curve + fee;
    }

    function quoteSell(uint256 id, uint256 amount) external view returns (uint256 back, uint256 fee) {
        _requireDesk(id);
        if (amount == 0 || amount > supplyOf[id]) revert BadAmount();
        uint256 curve = _curveSell(supplyOf[id], amount);
        fee = _fee(curve);
        back = curve - fee;
    }

    function buy(uint256 id, uint256 amount) external {
        _requireDesk(id);
        uint256 curve = _curveBuy(supplyOf[id], amount);
        uint256 fee = _fee(curve);
        supplyOf[id] += amount;
        balanceOf[id][msg.sender] += amount;
        tillOf[id] += fee;
        usdg.transferFrom(msg.sender, address(this), curve + fee);
        emit Bought(id, msg.sender, amount, curve + fee, fee);
    }

    function sell(uint256 id, uint256 amount) external {
        _requireDesk(id);
        if (amount == 0 || amount > MAX_AMOUNT) revert BadAmount();
        if (balanceOf[id][msg.sender] < amount || supplyOf[id] < amount) revert NoneHeld();
        uint256 curve = _curveSell(supplyOf[id], amount);
        uint256 fee = _fee(curve);
        supplyOf[id] -= amount;
        balanceOf[id][msg.sender] -= amount;
        tillOf[id] += fee;
        usdg.transfer(msg.sender, curve - fee);
        emit Sold(id, msg.sender, amount, curve - fee, fee);
    }

    /// @notice The desk owner takes the cover. A listed or working desk waits.
    function draw(uint256 id) external {
        address holder = desk.ownerOf(id);
        if (holder == address(0) || holder == desk.pit() || holder == desk.showroom()) revert NotOwner();
        uint256 amount = tillOf[id];
        if (amount == 0) revert EmptyTill();
        tillOf[id] = 0;
        usdg.transfer(holder, amount);
        emit Drawn(id, holder, amount);
    }

    function _requireDesk(uint256 id) internal view {
        if (desk.ownerOf(id) == address(0)) revert BadId();
    }

    function _fee(uint256 curve) internal pure returns (uint256) {
        return (curve * FEE_BPS) / 10_000;
    }

    function _curveBuy(uint256 supply, uint256 amount) internal pure returns (uint256) {
        if (amount == 0 || amount > MAX_AMOUNT) revert BadAmount();
        uint256 rise = amount * supply + (amount * (amount - 1)) / 2;
        return amount * BASE + STEP * rise;
    }

    function _curveSell(uint256 supply, uint256 amount) internal pure returns (uint256) {
        uint256 rise = amount * (supply - 1) - (amount * (amount - 1)) / 2;
        return amount * BASE + STEP * rise;
    }
}
