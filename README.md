# The Floor

A third-party room of Night Ledger. Desks hold USDG and STONK. A desk on shift is the pit. Swap fees stay in the working tills, and new STONK is paid to those same desks. An idle desk earns nothing.

This is not a Robinhood product. Yield here is swap fees plus new STONK. Nothing on the floor promises a profit.

## The street

One footer runs across the rooms. The street is on the left. The room you are in continues after the divider, with an icon and a name. The current item is lime.

| Room | Where | What it is |
| --- | --- | --- |
| Book | https://doghood.aibusiness.fun/ | Night Ledger. The coin, the bow, the seed, the street. |
| Floor | https://doghood.aibusiness.fun/floor | The pixel, then the tape, then a practice desk. |
| Dex | https://dex.aibusiness.fun/ | Swaps and NFTs on Robinhood Chain. |
| Greeting | https://gm.aibusiness.fun/ | Say GM on Robinhood Chain. A streak, not a payout. |
| Field | https://mine.aibusiness.fun/ | A small field. Three free cuts. Source in `Laszlo23/hoodmine`. |
| Hood | https://dex.aibusiness.fun/rfgame | Five castles with a Rare Friend. The HOOD on the score is simulated. |
| Seats | https://nft.aibusiness.fun/ | TICKPIX. Pixel seats on Robinhood Chain. |
| Names | https://doghood.aibusiness.fun/floor/names | A .hood name points at a wallet. Holding it earns nothing. If street.hood lapses, the subnames stop resolving. |
| Stock | https://doghood.aibusiness.fun/floor/stock | Robinhood stock tokens. A debt security that tracks a price. Not a share. No buy button. |
| Keys | https://doghood.aibusiness.fun/floor/keys | A practice pass to a desk. Play USDG. The cover stays with the desk. Holding it earns nothing. |
| Whale | https://playwhale.io/ | A real-money casino and sportsbook. A bet can be lost. |
| Aura OS | https://aibusiness.fun/ | The company operating system. Not part of the floor contracts. |
| Aura Local | https://review.aibusiness.fun/ | Review requests after a real visit. |

The shared footer script is `web/public/street.js`. The floor renders the same bar in `web/components/Street.tsx`. A room with its own tabs fills `#hood-app`, so those tabs start where the street ends.

The same map, in plain words, is on the site at https://doghood.aibusiness.fun/floor/guide.

## What you meet first

1. The pixel. TICKPIX on Robinhood Chain. While the phase is public, a seat is 0.0001 ETH and a wallet can take five. The floor shows seats left and the latest mints. A seat is a pixel. It does not earn.
2. The tape. Live USDG, the dollar pool, the NVDA token, the SPY token, and $HOOD. Sourced notes sit under the numbers. The full set is `/wire`. A Stock Token tracks a price and does not make the holder a shareholder.
3. The practice desk. Mock coins on the practice table. The pit and the showroom are that same table. Come back for a new seat, a moved tape, or a till that changed while a shift was open.

## Two chains

| | Practice table | Robinhood Chain |
| --- | --- | --- |
| Chain id | 46631 in production, 31337 on a local Anvil | 4663 |
| RPC | https://doghood.aibusiness.fun/floor/rpc | https://rpc.mainnet.chain.robinhood.com |
| Gas | Practice ETH | ETH |
| USDG | Mock, 18 decimals | Global Dollar, 6 decimals, `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168` |
| Floor contracts | Seated | Not seated. The deployer cannot pay gas yet. |

The public site sets `NEXT_PUBLIC_WALLET_ONLY=1`. Every mint, draw, stock, shift, swap, claim, list, and buy waits for a wallet confirmation. The old A/B practice seats are compiled out of that build.

## How a desk earns

1. Connect a wallet.
2. Draw 10,000 USDG and 10,000 STONK. The draw reverts on chain id 1 and on 4663.
3. Mint a desk. The chain rolls the tier. About 70% paper, 25% brass, 5% ink.
4. Stock both coins. One coin cannot open a shift.
5. Open the shift. The bag becomes pit liquidity. Shares are `2 * sqrt(usdg * scale * stonk)`.
6. Swaps pay a 0.30% fee that stays in the reserves (`997/1000`). The till is the geometric size of the bag. The screen shows a gain only when that size is above the size at open.
7. Claim waits new STONK, or close the shift and list the desk. The buyer receives the seat, the bag, and the tier.

Paper takes one share of the new STONK. Brass takes a quarter more. Ink takes half again. Weight is shares times the tier multiplier. Emissions are `1` STONK per second across the working weight. Idle and listed desks are outside that weight.

A listed desk cannot move its coins. A desk on shift cannot be listed. A seller cannot buy their own listing.

## The vault and the eye

The vault on the floor is one next step. No seat yet: mint. Empty seat: draw both coins and stock. Full bag: open the shift. Open shift: the till, then the desk.

The eye at `/floor/eye` reads Robinhood Chain every half minute.

- TICKPIX phase, minted count, and the latest seats.
- The HOOD/WETH pool `0xf27827ca8600e5c79b371f5b30e5a0e889bc7c44`.

$HOOD is `0xC7749BCFDC8d06FC246be556f4EAD75Ac7E1320c`. The pool is thin and often quiet. The eye prints the live price, the pool size, and the day’s volume. A quiet day is shown as a quiet day.

## TICKPIX

Contract `0xa1F563AA9AFF537b8D1dD551B4DB9eFc9EC2D117` on chain 4663. Supply cap 4663. Phase is public. Price `0.0001` ETH. Five seats a wallet. `totalSupply` reverts; the count is `totalMinted`. The site reads the phase from the public RPC before a wallet is connected. The mint itself still requires a wallet confirmation. The share card is `https://nft.aibusiness.fun/og.png`.

The free CCFF00 window ended on 12 Sep 2026. The site no longer offers that mint.

## Practice contracts

Deployed from Anvil account A, nonce zero. The same addresses are in `web/lib/addresses.json`. The file’s `chainId` is the local 31337. Production uses the env chain id.

| Contract | Address |
| --- | --- |
| STONK | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| Mock USDG | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| Desk | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| Pit | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |
| Showroom | `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9` |

`Pit.usdgScale` is `10 ** (18 - decimals)`. The mock is 18, so the scale is 1. A 6-decimal USDG is scaled up inside the till math.

The practice RPC is a proxy. It allows `eth_`, `net_`, and `web3_` reads, plus a signed `eth_sendRawTransaction`. It refuses `eth_sendTransaction`, `eth_sign`, the typed-data sign methods, and Anvil admin methods. `eth_accounts` returns an empty list. The practice keys in `contracts/script/Deploy.sol` are Anvil’s published defaults. They are for this table only. Do not fund them on Robinhood Chain.

## Run it locally

Foundry and Node 22.

```bash
anvil --host 127.0.0.1 --port 8545 --chain-id 31337 --block-time 1
```

```bash
cd contracts
forge test
forge script script/Deploy.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

```bash
cd web
npm install
npm run dev
```

Leave `NEXT_PUBLIC_WALLET_ONLY` unset locally if you want the two practice seats. Set it to `1` to force a browser wallet.

Production build:

```bash
cd web
export NEXT_PUBLIC_BASE_PATH=/floor
export NEXT_PUBLIC_ANVIL_RPC=https://doghood.aibusiness.fun/floor/rpc
export NEXT_PUBLIC_ANVIL_CHAIN_ID=46631
export NEXT_PUBLIC_WALLET_ONLY=1
npm run build
npm run start -- --hostname 127.0.0.1 --port 3030
```

Caddy strips `/floor` and proxies to that process. Desk links are `/floor/desk?id=1`. The dynamic `/desk/[id]` route redirects there so the page hydrates.

## Rooms in the app

| Path | Room |
| --- | --- |
| `/` | Floor. The pixel, the tape, then the practice desk. |
| `/wire` | The news. Alpha, the street, and the change in the market, with live numbers. |
| `/blog` | Night Paper. Longer notes on Robinhood, the pixel, and what the rails can hold. |
| `/guide` | The plain guide on the site. What to tap, what is real, and the addresses. |
| `/og.png` | The share card. 1200×630. |
| `/manifest.webmanifest` | Installable app manifest for the floor. |
| `/pit` | Swap. |
| `/showroom` | Listings. |
| `/desk?id=` | One desk. Shift, claim, stock, list. |
| `/eye` | JSON for the street eye. |
| `/rpc` | Practice chain proxy. |
