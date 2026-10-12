// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {IHoodController, IHoodRegistry, IHoodResolver, StreetNames} from "../src/StreetNames.sol";

contract MockRegistry is IHoodRegistry {
    mapping(bytes32 => address) public owners;

    function owner(bytes32 node) external view returns (address) {
        return owners[node];
    }

    function seat(bytes32 node, address who) external {
        owners[node] = who;
    }

    function setSubnodeRecord(bytes32 node, bytes32 label, address who, address, uint64) external {
        require(owners[node] == msg.sender, "not parent");
        owners[keccak256(abi.encodePacked(node, label))] = who;
    }

    function setOwner(bytes32 node, address who) external {
        require(owners[node] == msg.sender, "not owner");
        owners[node] = who;
    }
}

contract MockResolver is IHoodResolver {
    MockRegistry public registry;
    mapping(bytes32 => address) public addrOf;

    constructor(MockRegistry registry_) {
        registry = registry_;
    }

    function setAddr(bytes32 node, address who) external {
        require(registry.owner(node) == msg.sender, "not owner");
        addrOf[node] = who;
    }
}

contract MockController is IHoodController {
    string public lastName;
    uint256 public lastDuration;
    uint256 public lastValue;

    function renew(string calldata name, uint256 duration) external payable {
        lastName = name;
        lastDuration = duration;
        lastValue = msg.value;
    }
}

contract StreetNamesTest is Test {
    bytes32 internal constant PARENT = bytes32(uint256(1));

    MockRegistry internal registry;
    MockResolver internal resolver;
    MockController internal controller;
    StreetNames internal names;

    function setUp() public {
        registry = new MockRegistry();
        resolver = new MockResolver(registry);
        controller = new MockController();
        names = new StreetNames(IHoodRegistry(address(registry)), IHoodResolver(address(resolver)), IHoodController(address(controller)), PARENT);
        registry.seat(PARENT, address(names));
    }

    function test_buyPointsTheNameAtTheBuyer() public {
        address buyer = makeAddr("buyer");
        uint256 cover = names.COVER();
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        names.buy{value: cover}("alice");

        bytes32 node = keccak256(abi.encodePacked(PARENT, keccak256("alice")));
        assertEq(registry.owner(node), buyer);
        assertEq(resolver.addrOf(node), buyer);
        assertEq(names.till(), names.COVER());
    }

    function test_badLabelsRevert() public {
        uint256 cover = names.COVER();
        vm.expectRevert(StreetNames.BadLabel.selector);
        names.buy{value: cover}("ab");
        vm.expectRevert(StreetNames.BadLabel.selector);
        names.buy{value: cover}("Alice");
        vm.expectRevert(StreetNames.BadLabel.selector);
        names.buy{value: cover}("-ab");
        vm.expectRevert(StreetNames.BadLabel.selector);
        names.buy{value: cover}("ab-");
    }

    function test_wrongCoverReverts() public {
        uint256 cover = names.COVER();
        vm.expectRevert(StreetNames.BadCover.selector);
        names.buy{value: cover - 1}("alice");
    }

    function test_takenReverts() public {
        uint256 cover = names.COVER();
        names.buy{value: cover}("alice");
        vm.expectRevert(StreetNames.Taken.selector);
        names.buy{value: cover}("alice");
    }

    function test_buyWithoutTheParentReverts() public {
        uint256 cover = names.COVER();
        registry.seat(PARENT, address(this));
        vm.expectRevert(StreetNames.NotParent.selector);
        names.buy{value: cover}("alice");
    }

    function test_drawPaysTheOwner() public {
        names.buy{value: names.COVER()}("bob");
        uint256 before = address(this).balance;
        names.draw();
        assertEq(address(this).balance - before, names.COVER());
        assertEq(names.till(), 0);
    }

    function test_strangerCannotDraw() public {
        names.buy{value: names.COVER()}("bob");
        vm.prank(makeAddr("stranger"));
        vm.expectRevert(StreetNames.NotOwner.selector);
        names.draw();
    }

    function test_renewForwardsThePayment() public {
        names.renew{value: 0.002 ether}(365 days);
        assertEq(controller.lastName(), "street");
        assertEq(controller.lastDuration(), 365 days);
        assertEq(controller.lastValue(), 0.002 ether);
    }

    receive() external payable {}
}
