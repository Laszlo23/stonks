// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Desk} from "./Desk.sol";
import {Token} from "./Token.sol";

/// @notice Sells an idle desk. The NFT sits here. The bag stays in the desk.
contract Showroom {
    struct Listing {
        address seller;
        uint256 price;
    }

    Desk public immutable desk;
    Token public immutable usdg;

    mapping(uint256 => Listing) public listing;

    uint256 private locked = 1;

    event Listed(uint256 indexed id, address indexed seller, uint256 price);
    event Cancelled(uint256 indexed id, address indexed seller);
    event Bought(uint256 indexed id, address indexed buyer, uint256 price);

    error NotSeller();
    error NotListed();
    error BadPrice();
    error Reentered();

    modifier nonReentrant() {
        if (locked != 1) revert Reentered();
        locked = 2;
        _;
        locked = 1;
    }

    constructor(Desk desk_, Token usdg_) {
        desk = desk_;
        usdg = usdg_;
    }

    function list(uint256 id, uint256 price) external nonReentrant {
        if (price == 0) revert BadPrice();
        desk.escrow(id, msg.sender);
        listing[id] = Listing({seller: msg.sender, price: price});
        emit Listed(id, msg.sender, price);
    }

    function cancel(uint256 id) external nonReentrant {
        Listing memory item = listing[id];
        if (item.seller == address(0)) revert NotListed();
        if (item.seller != msg.sender) revert NotSeller();
        delete listing[id];
        desk.release(id, msg.sender);
        emit Cancelled(id, msg.sender);
    }

    function buy(uint256 id) external nonReentrant {
        Listing memory item = listing[id];
        if (item.seller == address(0)) revert NotListed();
        if (item.seller == msg.sender) revert NotSeller();
        delete listing[id];
        usdg.transferFrom(msg.sender, item.seller, item.price);
        desk.release(id, msg.sender);
        emit Bought(id, msg.sender, item.price);
    }
}
