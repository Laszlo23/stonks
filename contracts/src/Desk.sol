// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Token} from "./Token.sol";

/// @notice An NFT desk. While idle, it holds a bag of USDG and STONK.
///         On shift, the pit holds that bag. Listed, the showroom holds the NFT
///         and the bag stays frozen inside the desk.
contract Desk {
    enum Status {
        Idle,
        OnShift,
        Listed
    }

    string public constant name = "Stonks Desk";
    string public constant symbol = "DESK";

    Token public immutable usdg;
    Token public immutable stonk;

    address public owner;
    address public pit;
    address public showroom;
    uint256 public nextId = 1;

    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    mapping(uint256 => uint256) public bagUsdg;
    mapping(uint256 => uint256) public bagStonk;
    mapping(uint256 => uint8) public tierOf;
    mapping(uint256 => Status) public statusOf;

    event Transfer(address indexed from, address indexed to, uint256 indexed id);
    event Approval(address indexed owner, address indexed spender, uint256 indexed id);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event DeskMinted(uint256 indexed id, address indexed player, uint8 tier);
    event BagChanged(uint256 indexed id, uint256 usdgAmt, uint256 stonkAmt);

    error NotOwner();
    error NotIdle();
    error NotPit();
    error NotShowroom();
    error FloorSet();
    error BadId();
    error EmptyBag();
    error NotApproved();

    constructor(Token usdg_, Token stonk_) {
        usdg = usdg_;
        stonk = stonk_;
        owner = msg.sender;
    }

    function setFloor(address pit_, address showroom_) external {
        if (msg.sender != owner) revert NotOwner();
        if (pit != address(0)) revert FloorSet();
        if (pit_ == address(0) || showroom_ == address(0)) revert BadId();
        pit = pit_;
        showroom = showroom_;
    }

    /// @dev Game-grade roll: 70% paper, 25% brass, 5% ink. Not a production draw.
    function mint() external returns (uint256 id) {
        id = nextId++;
        uint256 roll = uint256(keccak256(abi.encodePacked(block.prevrandao, msg.sender, id))) % 100;
        uint8 tier;
        if (roll < 70) tier = 0;
        else if (roll < 95) tier = 1;
        else tier = 2;
        tierOf[id] = tier;
        statusOf[id] = Status.Idle;
        _mint(msg.sender, id);
        emit DeskMinted(id, msg.sender, tier);
    }

    function deposit(uint256 id, uint256 usdgAmt, uint256 stonkAmt) external {
        _requireIdleOwner(id);
        if (usdgAmt == 0 && stonkAmt == 0) revert EmptyBag();
        if (usdgAmt > 0) {
            usdg.transferFrom(msg.sender, address(this), usdgAmt);
            bagUsdg[id] += usdgAmt;
        }
        if (stonkAmt > 0) {
            stonk.transferFrom(msg.sender, address(this), stonkAmt);
            bagStonk[id] += stonkAmt;
        }
        emit BagChanged(id, bagUsdg[id], bagStonk[id]);
    }

    function withdraw(uint256 id, uint256 usdgAmt, uint256 stonkAmt) external {
        _requireIdleOwner(id);
        if (usdgAmt == 0 && stonkAmt == 0) revert EmptyBag();
        if (usdgAmt > 0) {
            bagUsdg[id] -= usdgAmt;
            usdg.transfer(msg.sender, usdgAmt);
        }
        if (stonkAmt > 0) {
            bagStonk[id] -= stonkAmt;
            stonk.transfer(msg.sender, stonkAmt);
        }
        emit BagChanged(id, bagUsdg[id], bagStonk[id]);
    }

    function bagOf(uint256 id) external view returns (uint256 usdgAmt, uint256 stonkAmt) {
        return (bagUsdg[id], bagStonk[id]);
    }

    function seizeBag(uint256 id) external returns (uint256 usdgAmt, uint256 stonkAmt) {
        if (msg.sender != pit) revert NotPit();
        if (statusOf[id] != Status.Idle) revert NotIdle();
        if (ownerOf[id] == address(0)) revert BadId();
        usdgAmt = bagUsdg[id];
        stonkAmt = bagStonk[id];
        if (usdgAmt == 0 || stonkAmt == 0) revert EmptyBag();
        bagUsdg[id] = 0;
        bagStonk[id] = 0;
        statusOf[id] = Status.OnShift;
        usdg.transfer(pit, usdgAmt);
        stonk.transfer(pit, stonkAmt);
        emit BagChanged(id, 0, 0);
    }

    function restoreBag(uint256 id, uint256 usdgAmt, uint256 stonkAmt) external {
        if (msg.sender != pit) revert NotPit();
        if (statusOf[id] != Status.OnShift) revert NotIdle();
        statusOf[id] = Status.Idle;
        bagUsdg[id] = usdgAmt;
        bagStonk[id] = stonkAmt;
        emit BagChanged(id, usdgAmt, stonkAmt);
    }

    function escrow(uint256 id, address holder) external {
        if (msg.sender != showroom) revert NotShowroom();
        if (ownerOf[id] != holder) revert NotOwner();
        if (statusOf[id] != Status.Idle) revert NotIdle();
        statusOf[id] = Status.Listed;
        _transfer(holder, showroom, id);
    }

    function release(uint256 id, address to) external {
        if (msg.sender != showroom) revert NotShowroom();
        if (statusOf[id] != Status.Listed) revert NotIdle();
        if (ownerOf[id] != showroom) revert NotOwner();
        statusOf[id] = Status.Idle;
        _transfer(showroom, to, id);
    }

    function approve(address spender, uint256 id) external {
        address holder = ownerOf[id];
        if (msg.sender != holder && !isApprovedForAll[holder][msg.sender]) revert NotApproved();
        getApproved[id] = spender;
        emit Approval(holder, spender, id);
    }

    function setApprovalForAll(address operator, bool approved) external {
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function transferFrom(address from, address to, uint256 id) public {
        if (statusOf[id] != Status.Idle) revert NotIdle();
        if (ownerOf[id] != from) revert NotOwner();
        if (to == address(0)) revert BadId();
        if (msg.sender != from && getApproved[id] != msg.sender && !isApprovedForAll[from][msg.sender]) {
            revert NotApproved();
        }
        _transfer(from, to, id);
    }

    function safeTransferFrom(address from, address to, uint256 id) external {
        transferFrom(from, to, id);
    }

    function safeTransferFrom(address from, address to, uint256 id, bytes calldata) external {
        transferFrom(from, to, id);
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x80ac58cd || interfaceId == 0x01ffc9a7;
    }

    function _requireIdleOwner(uint256 id) internal view {
        if (ownerOf[id] == address(0)) revert BadId();
        if (statusOf[id] != Status.Idle) revert NotIdle();
        if (ownerOf[id] != msg.sender) revert NotOwner();
    }

    function _mint(address to, uint256 id) internal {
        if (to == address(0)) revert BadId();
        ownerOf[id] = to;
        balanceOf[to] += 1;
        emit Transfer(address(0), to, id);
    }

    function _transfer(address from, address to, uint256 id) internal {
        if (to == address(0)) revert BadId();
        balanceOf[from] -= 1;
        balanceOf[to] += 1;
        ownerOf[id] = to;
        delete getApproved[id];
        emit Transfer(from, to, id);
    }
}
