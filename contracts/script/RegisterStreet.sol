// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {IHoodController, IHoodRegistry, IHoodResolver, StreetNames} from "../src/StreetNames.sol";

interface IHoodRegistrar is IHoodController {
    function available(string calldata name) external view returns (bool);
    function price(string calldata name, uint256 duration) external view returns (uint256);
    function minCommitAge() external view returns (uint256);
    function makeCommitment(string calldata name, address owner, bytes32 secret) external view returns (bytes32);
    function commit(bytes32 commitment) external;
    function register(string calldata name, address owner, uint256 duration, bytes32 secret) external payable;
}

/// @notice Seats street.hood on the hood.ag registrar, owned by StreetNames.
///         Stops before any broadcast when the deployer cannot pay the name plus gas.
contract RegisterStreet is Script {
    address internal constant DEPLOYER = 0x2CCf1076A9DCA4d656A156d6036Cc2066c596AF5;
    address internal constant REGISTRY = 0x3E717dc89AAF4605b607324329EEeB0a8B3C8A1c;
    address internal constant RESOLVER = 0x072C7a66a6D52B23274470b86096AFCBF816CA0B;
    address internal constant CONTROLLER = 0x7900b2B8Cc3f0616B18C68AdA7E115A9022Ca04a;
    bytes32 internal constant PARENT = 0xe53fc30b856d0932ab00a9321c7a444ee971220c8a940119b9cb0cd7f112e0dd;
    uint256 internal constant YEAR = 365 days;
    uint256 internal constant GAS_PAD = 0.0002 ether;

    function run() external {
        (uint256 cost, uint256 balance, bool open) = _quote();
        if (!open || balance < cost + GAS_PAD) {
            console.log("stop");
            return;
        }
        uint256 key = vm.envUint("DEPLOYER_KEY");
        vm.startBroadcast(key);
        StreetNames names = new StreetNames(
            IHoodRegistry(REGISTRY),
            IHoodResolver(RESOLVER),
            IHoodController(CONTROLLER),
            PARENT
        );
        bytes32 secret = keccak256(abi.encodePacked("street.hood", address(names), block.chainid));
        IHoodRegistrar(CONTROLLER).commit(IHoodRegistrar(CONTROLLER).makeCommitment("street", address(names), secret));
        vm.stopBroadcast();
        console.log("names", address(names));
        console.log("wait", IHoodRegistrar(CONTROLLER).minCommitAge());
        console.logBytes32(secret);
    }

    /// @notice Second step, after minCommitAge. Also stops when the deployer cannot pay.
    function reveal() external {
        (uint256 cost, uint256 balance, bool open) = _quote();
        if (!open || balance < cost + GAS_PAD) {
            console.log("stop");
            return;
        }
        address names = vm.envAddress("NAMES");
        bytes32 secret = vm.envBytes32("SECRET");
        uint256 key = vm.envUint("DEPLOYER_KEY");
        vm.startBroadcast(key);
        IHoodRegistrar(CONTROLLER).register{value: cost}("street", names, YEAR, secret);
        vm.stopBroadcast();
    }

    function _quote() internal view returns (uint256 cost, uint256 balance, bool open) {
        IHoodRegistrar controller = IHoodRegistrar(CONTROLLER);
        cost = controller.price("street", YEAR);
        balance = DEPLOYER.balance;
        open = controller.available("street");
        console.log("available", open);
        console.log("price", cost);
        console.log("balance", balance);
    }
}
