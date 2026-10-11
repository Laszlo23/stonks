// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Desk} from "./Desk.sol";
import {Token} from "./Token.sol";

/// @notice Constant-product pit. A desk on shift is the liquidity.
///         The 0.30% swap fee stays in the reserves, so the bag is larger
///         when the shift ends. Extra STONK is minted on top, by weight.
contract Pit {
    uint256 public constant FEE_NUM = 997;
    uint256 public constant FEE_DEN = 1000;
    uint256 public constant REWARD_PER_SECOND = 1 ether;
    uint256 public constant PRECISION = 1e18;
    uint256 public constant MINIMUM_LIQUIDITY = 1000;

    Desk public immutable desk;
    Token public immutable usdg;
    Token public immutable stonk;
    /// @dev Brings USDG up to 18 decimals for the till. Real USDG uses 6.
    uint256 public immutable usdgScale;

    uint256 public reserveUsdg;
    uint256 public reserveStonk;
    uint256 public totalShares;
    uint256 public totalWeight;
    uint256 public accPerWeight;
    uint256 public lastUpdate;

    mapping(uint256 => uint256) public lpShares;
    mapping(uint256 => uint256) public weightOf;
    mapping(uint256 => uint256) public rewardDebt;
    mapping(uint256 => uint256) public openedSize;

    struct SwapTape {
        address trader;
        bool usdgIn;
        uint256 amountIn;
        uint256 amountOut;
        uint64 timestamp;
    }

    SwapTape public lastSwap;

    uint256 private locked = 1;

    event ShiftOpened(uint256 indexed id, address indexed player, uint256 shares, uint256 size);
    event ShiftClosed(uint256 indexed id, address indexed player, uint256 usdgAmt, uint256 stonkAmt);
    event Claimed(uint256 indexed id, address indexed player, uint256 amount);
    event Swapped(address indexed trader, bool usdgIn, uint256 amountIn, uint256 amountOut);

    error NotOwner();
    error Slippage();
    error NoLiquidity();
    error Reentered();
    error BadAmount();

    modifier nonReentrant() {
        if (locked != 1) revert Reentered();
        locked = 2;
        _;
        locked = 1;
    }

    constructor(Desk desk_, Token usdg_, Token stonk_) {
        desk = desk_;
        usdg = usdg_;
        stonk = stonk_;
        uint8 places = usdg_.decimals();
        if (places > 18) revert BadAmount();
        usdgScale = 10 ** (18 - places);
        lastUpdate = block.timestamp;
    }

    function openShift(uint256 id) external nonReentrant {
        if (desk.ownerOf(id) != msg.sender) revert NotOwner();
        _poke();
        (uint256 usdgAmt, uint256 stonkAmt) = desk.seizeBag(id);
        (usdgAmt, stonkAmt) = _trimToPool(usdgAmt, stonkAmt);
        uint256 minted = _addLiquidity(usdgAmt, stonkAmt);
        lpShares[id] = minted;
        uint256 weight = (minted * _multiplier(desk.tierOf(id))) / 100;
        weightOf[id] = weight;
        totalWeight += weight;
        rewardDebt[id] = (weight * accPerWeight) / PRECISION;
        (uint256 shareUsdg, uint256 shareStonk) = _shareAmounts(id);
        openedSize[id] = _bagSize(shareUsdg, shareStonk);
        emit ShiftOpened(id, msg.sender, minted, openedSize[id]);
    }

    function closeShift(uint256 id) external nonReentrant {
        if (desk.ownerOf(id) != msg.sender) revert NotOwner();
        uint256 shares = lpShares[id];
        if (shares == 0) revert NoLiquidity();
        _poke();
        uint256 pending = _earned(id);

        uint256 weight = weightOf[id];
        totalWeight -= weight;
        weightOf[id] = 0;
        rewardDebt[id] = 0;
        lpShares[id] = 0;
        openedSize[id] = 0;

        uint256 usdgOut = (reserveUsdg * shares) / totalShares;
        uint256 stonkOut = (reserveStonk * shares) / totalShares;
        if (usdgOut == 0 || stonkOut == 0) revert BadAmount();
        reserveUsdg -= usdgOut;
        reserveStonk -= stonkOut;
        totalShares -= shares;

        usdg.transfer(address(desk), usdgOut);
        stonk.transfer(address(desk), stonkOut);
        desk.restoreBag(id, usdgOut, stonkOut);

        if (pending > 0) {
            stonk.mint(msg.sender, pending);
            emit Claimed(id, msg.sender, pending);
        }
        emit ShiftClosed(id, msg.sender, usdgOut, stonkOut);
    }

    function claim(uint256 id) external nonReentrant {
        if (desk.ownerOf(id) != msg.sender) revert NotOwner();
        if (weightOf[id] == 0) revert NoLiquidity();
        _poke();
        uint256 pending = _earned(id);
        rewardDebt[id] = (weightOf[id] * accPerWeight) / PRECISION;
        if (pending == 0) revert BadAmount();
        stonk.mint(msg.sender, pending);
        emit Claimed(id, msg.sender, pending);
    }

    function swap(bool usdgIn, uint256 amountIn, uint256 minOut) external nonReentrant returns (uint256 amountOut) {
        if (amountIn == 0) revert BadAmount();
        amountOut = _quoteOut(usdgIn, amountIn);
        if (amountOut == 0 || amountOut < minOut) revert Slippage();

        if (usdgIn) {
            reserveUsdg += amountIn;
            reserveStonk -= amountOut;
        } else {
            reserveStonk += amountIn;
            reserveUsdg -= amountOut;
        }

        Token tokenIn = usdgIn ? usdg : stonk;
        Token tokenOut = usdgIn ? stonk : usdg;
        tokenIn.transferFrom(msg.sender, address(this), amountIn);
        tokenOut.transfer(msg.sender, amountOut);

        lastSwap = SwapTape({
            trader: msg.sender,
            usdgIn: usdgIn,
            amountIn: amountIn,
            amountOut: amountOut,
            timestamp: uint64(block.timestamp)
        });
        emit Swapped(msg.sender, usdgIn, amountIn, amountOut);
    }

    function quote(bool usdgIn, uint256 amountIn) external view returns (uint256 amountOut, uint256 fee) {
        amountOut = _quoteOut(usdgIn, amountIn);
        fee = (amountIn * 3) / 1000;
    }

    function position(uint256 id)
        external
        view
        returns (
            uint256 shares,
            uint256 usdgAmt,
            uint256 stonkAmt,
            uint256 claimable,
            uint256 sizeNow,
            uint256 sizeOpened
        )
    {
        shares = lpShares[id];
        (usdgAmt, stonkAmt) = _shareAmounts(id);
        claimable = _pending(id);
        sizeNow = _bagSize(usdgAmt, stonkAmt);
        sizeOpened = openedSize[id];
    }

    function _trimToPool(uint256 usdgAmt, uint256 stonkAmt) internal returns (uint256, uint256) {
        if (totalShares == 0) return (usdgAmt, stonkAmt);

        uint256 usdgUse = usdgAmt;
        uint256 stonkUse = stonkAmt;
        uint256 usdgBalanced = (stonkAmt * reserveUsdg) / reserveStonk;
        if (usdgBalanced < usdgAmt) {
            usdgUse = usdgBalanced;
        } else {
            uint256 stonkBalanced = (usdgAmt * reserveStonk) / reserveUsdg;
            if (stonkBalanced < stonkAmt) stonkUse = stonkBalanced;
        }
        if (usdgUse == 0 || stonkUse == 0) revert BadAmount();
        if (usdgAmt > usdgUse) usdg.transfer(msg.sender, usdgAmt - usdgUse);
        if (stonkAmt > stonkUse) stonk.transfer(msg.sender, stonkAmt - stonkUse);
        return (usdgUse, stonkUse);
    }

    function _addLiquidity(uint256 usdgAmt, uint256 stonkAmt) internal returns (uint256 minted) {
        if (totalShares == 0) {
            uint256 full = _sqrt(usdgAmt * stonkAmt);
            if (full <= MINIMUM_LIQUIDITY) revert NoLiquidity();
            totalShares = full;
            minted = full - MINIMUM_LIQUIDITY;
        } else {
            uint256 fromUsdg = (usdgAmt * totalShares) / reserveUsdg;
            uint256 fromStonk = (stonkAmt * totalShares) / reserveStonk;
            minted = fromUsdg < fromStonk ? fromUsdg : fromStonk;
            if (minted == 0) revert NoLiquidity();
            totalShares += minted;
        }
        reserveUsdg += usdgAmt;
        reserveStonk += stonkAmt;
    }

    function _quoteOut(bool usdgIn, uint256 amountIn) internal view returns (uint256) {
        uint256 reserveIn = usdgIn ? reserveUsdg : reserveStonk;
        uint256 reserveOut = usdgIn ? reserveStonk : reserveUsdg;
        if (reserveIn == 0 || reserveOut == 0 || amountIn == 0) return 0;
        uint256 amountInWithFee = amountIn * FEE_NUM;
        uint256 out = (amountInWithFee * reserveOut) / (reserveIn * FEE_DEN + amountInWithFee);
        if (out >= reserveOut) return 0;
        return out;
    }

    function _poke() internal {
        if (totalWeight == 0) {
            lastUpdate = block.timestamp;
            return;
        }
        uint256 elapsed = block.timestamp - lastUpdate;
        if (elapsed > 0) {
            accPerWeight += (elapsed * REWARD_PER_SECOND * PRECISION) / totalWeight;
        }
        lastUpdate = block.timestamp;
    }

    function _pending(uint256 id) internal view returns (uint256) {
        uint256 acc = accPerWeight;
        if (totalWeight > 0) {
            uint256 elapsed = block.timestamp - lastUpdate;
            if (elapsed > 0) {
                acc += (elapsed * REWARD_PER_SECOND * PRECISION) / totalWeight;
            }
        }
        return _earnedAt(id, acc);
    }

    function _earned(uint256 id) internal view returns (uint256) {
        return _earnedAt(id, accPerWeight);
    }

    function _earnedAt(uint256 id, uint256 acc) internal view returns (uint256) {
        uint256 weight = weightOf[id];
        if (weight == 0) return 0;
        uint256 accumulated = (weight * acc) / PRECISION;
        uint256 debt = rewardDebt[id];
        if (accumulated <= debt) return 0;
        return accumulated - debt;
    }

    function _shareAmounts(uint256 id) internal view returns (uint256 usdgAmt, uint256 stonkAmt) {
        uint256 shares = lpShares[id];
        if (shares == 0 || totalShares == 0) return (0, 0);
        usdgAmt = (reserveUsdg * shares) / totalShares;
        stonkAmt = (reserveStonk * shares) / totalShares;
    }

    /// @dev Geometric size of a bag. Fees raise the product, so this rises.
    function _bagSize(uint256 usdgAmt, uint256 stonkAmt) internal view returns (uint256) {
        if (usdgAmt == 0 || stonkAmt == 0) return 0;
        return 2 * _sqrt(usdgAmt * usdgScale * stonkAmt);
    }

    function _multiplier(uint8 tier) internal pure returns (uint256) {
        if (tier == 0) return 100;
        if (tier == 1) return 125;
        if (tier == 2) return 150;
        revert BadAmount();
    }

    function _sqrt(uint256 x) internal pure returns (uint256 y) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
