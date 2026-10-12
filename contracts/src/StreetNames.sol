// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IHoodRegistry {
    function owner(bytes32 node) external view returns (address);
    function setSubnodeRecord(bytes32 node, bytes32 label, address owner, address resolver, uint64 ttl) external;
    function setOwner(bytes32 node, address owner) external;
}

interface IHoodResolver {
    function setAddr(bytes32 node, address a) external;
}

interface IHoodController {
    function renew(string calldata name, uint256 duration) external payable;
}

/// @notice Sells subnames of street.hood. The contract holds the parent,
///         so a buyer cannot write a subname without paying the cover.
///         The cover sits in a till. Holding a name earns nothing.
contract StreetNames {
    IHoodRegistry public immutable registry;
    IHoodResolver public immutable resolver;
    IHoodController public immutable controller;
    bytes32 public immutable parentNode;

    string public constant PARENT = "street";
    uint256 public constant COVER = 0.001 ether;

    address public owner;
    uint256 public till;

    event Bought(string label, address indexed buyer, bytes32 indexed node);
    event Renewed(uint256 duration, uint256 paid);
    event Drawn(address indexed to, uint256 amount);

    error BadLabel();
    error BadCover();
    error Taken();
    error NotParent();
    error NotOwner();
    error EmptyTill();

    constructor(IHoodRegistry registry_, IHoodResolver resolver_, IHoodController controller_, bytes32 parentNode_) {
        registry = registry_;
        resolver = resolver_;
        controller = controller_;
        parentNode = parentNode_;
        owner = msg.sender;
    }

    /// @notice Buy `label.street.hood` and point it at the caller.
    function buy(string calldata label) external payable {
        if (msg.value != COVER) revert BadCover();
        if (registry.owner(parentNode) != address(this)) revert NotParent();
        bytes32 labelhash = _labelhash(label);
        bytes32 node = keccak256(abi.encodePacked(parentNode, labelhash));
        if (registry.owner(node) != address(0)) revert Taken();
        registry.setSubnodeRecord(parentNode, labelhash, address(this), address(resolver), 0);
        resolver.setAddr(node, msg.sender);
        registry.setOwner(node, msg.sender);
        till += msg.value;
        emit Bought(label, msg.sender, node);
    }

    /// @notice Extend street.hood. If this lapses, the subnames stop resolving.
    function renew(uint256 duration) external payable {
        if (msg.sender != owner) revert NotOwner();
        controller.renew{value: msg.value}(PARENT, duration);
        emit Renewed(duration, msg.value);
    }

    /// @notice Pay the till to the owner of this contract. The name itself pays nothing.
    function draw() external {
        if (msg.sender != owner) revert NotOwner();
        uint256 amount = till;
        if (amount == 0) revert EmptyTill();
        till = 0;
        (bool ok,) = owner.call{value: amount}("");
        require(ok, "draw");
        emit Drawn(owner, amount);
    }

    function _labelhash(string calldata label) internal pure returns (bytes32) {
        bytes memory raw = bytes(label);
        uint256 length = raw.length;
        if (length < 3 || length > 32) revert BadLabel();
        if (raw[0] == 0x2d || raw[length - 1] == 0x2d) revert BadLabel();
        for (uint256 i = 0; i < length; i++) {
            bytes1 c = raw[i];
            bool ok = (c >= 0x61 && c <= 0x7a) || (c >= 0x30 && c <= 0x39) || c == 0x2d;
            if (!ok) revert BadLabel();
        }
        return keccak256(raw);
    }
}
