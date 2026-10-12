export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  date: string;
  kicker: string;
  title: string;
  lede: string;
  image: string;
  source: string;
  href: string;
  notes?: { source: string; href: string }[];
  blocks: BlogBlock[];
};

export const posts: Post[] = [
  {
    slug: "september-belonged-to-robinhood",
    date: "12 Oct 2026",
    kicker: "The market",
    title: "September belonged to Robinhood.",
    lede: "In September, Robinhood took the largest share of on-chain stock-token trading. By 12 October the chain's day was quieter, and the deposits were still there.",
    image: "street.webp",
    source: "CoinDesk",
    href: "https://www.coindesk.com/research/stablecoins-and-tokenized-assets-report-october-2026",
    notes: [
      {
        source: "Pond Street Ledger, 12 Oct 2026",
        href: "https://www.pondstreetledger.com/robinhood-chain/state-of-the-chain",
      },
    ],
    blocks: [
      {
        type: "p",
        text: "CoinDesk's September read, published 6 October, put on-chain tokenized-equity trading at $15.6 billion. That was a record, up 16.4 percent from August, and a little above July's $15.4 billion. Robinhood was the largest venue. Its volume rose 407 percent to $6.57 billion, a 42 percent share, from 9.7 percent in August. The next venue, bStocks, fell 45.5 percent to $5.42 billion.",
      },
      {
        type: "quote",
        text: "A record month names a venue. It does not make the market deep.",
      },
      {
        type: "h",
        text: "What was actually tokenized",
      },
      {
        type: "p",
        text: "The stock of tokenized equities grew 13.7 percent to $4.87 billion. Securitize held the most of that, at $1.62 billion, then Ondo at $1.00 billion and xStocks at $874 million. On Robinhood Chain, a Stock Token is a debt security. It tracks a price. It does not make the holder a shareholder.",
      },
      {
        type: "h",
        text: "The week after",
      },
      {
        type: "p",
        text: "Pond Street, reading the chain on 12 October, still counted $1.06 billion locked, up 1.5 percent on the week. DEX volume for the day was $574 million, down 40.2 percent on the week, about 54 percent of everything locked. Since the chain opened, 617,936 tokens had been given a market. Of those past their first week, about 1 in 296 was still trading. The chain was minting about 6,060 new tokens a day. September can be the loud month. A Tuesday can still be thin.",
      },
    ],
  },
  {
    slug: "the-night-told-the-open",
    date: "11 Oct 2026",
    kicker: "The market",
    title: "The night told the open.",
    lede: "The IMF looked at tokenized stocks. Most of the trading happened while Wall Street was shut, and the opening bell caught up in five minutes. The market is still thin.",
    image: "coin.webp",
    source: "CoinDesk",
    href: "https://www.coindesk.com/business/2026/10/11/imf-finds-demand-for-tokenized-stocks-says-the-market-is-still-volatile-illiquid",
    notes: [
      {
        source: "Pond Street Ledger, 11 Oct 2026",
        href: "https://www.pondstreetledger.com/robinhood-chain/state-of-the-chain",
      },
      {
        source: "CoinDesk, 8 Oct 2026",
        href: "https://www.coindesk.com/business/2026/10/08/securitize-brings-apple-nvidia-and-tesla-to-solana-with-nyse-trading-in-the-works",
      },
    ],
    blocks: [
      {
        type: "p",
        text: "The IMF's October Global Financial Stability Report looked at the five most traded tokenized US equities, including Tesla, Nvidia, Alphabet, and a Nasdaq 100 measure, on both centralized and decentralized venues. More than half of that trading happened outside regular US market hours. About 80 percent of the trades were for less than one share.",
      },
      {
        type: "quote",
        text: "The night can move a price. It does not make the market deep.",
      },
      {
        type: "h",
        text: "What the open did with it",
      },
      {
        type: "p",
        text: "The overnight move was not noise the day session ignored. Within five minutes of the US open, the regular shares had taken in more than 85 percent of how the tokens had moved while the exchanges were shut. The same tokens were about 1.5 times as volatile as the shares they track, and the IMF called them significantly less liquid.",
      },
      {
        type: "p",
        text: "The whole tokenized real-world asset market was about $65 billion on 31 July. Tokenized equities were about $2.3 billion of that. Listed stock worldwide was just under $160 trillion in 2025, by SIFMA's count. Robinhood is one of the places that lists tokenized stocks. On Robinhood Chain, a Stock Token is a debt instrument. It tracks a price. It does not make the holder a shareholder.",
      },
      {
        type: "h",
        text: "Two other shapes",
      },
      {
        type: "p",
        text: "On 8 October, Securitize put 12 US stocks on Solana, including Apple, Nvidia, and Tesla. CoinDesk reported that each token is backed by a share and is meant to keep dividends and voting rights. It is a security entitlement, not a line on the company's own register. Trading starts on Securitize's platform and settles in USDC. A listing on the NYSE's planned 24-hour venue, and on the venue OKX and ICE have filed for, still depends on those venues opening.",
      },
      {
        type: "p",
        text: "On this chain, the crowd of tokens is a different story. Pond Street, reading the chain on 11 October, counted $1.06 billion locked and $582 million of DEX volume in a day. Since the chain opened, 617,936 tokens had been given a market. Of those past their first week, about 1 in 296 was still trading. A live price is not a deep market, and a new token is not a stock.",
      },
    ],
  },
  {
    slug: "chain-slowed",
    date: "10 Oct 2026",
    kicker: "Robinhood",
    title: "The chain slowed. The money stayed.",
    lede: "Daily transactions fell hard from the September peak. Deposits did not. The fee holiday now runs through the end of the year.",
    image: "street.webp",
    source: "CoinDesk",
    href: "https://www.coindesk.com/markets/2026/10/10/robinhood-chain-slowdown-spreads-from-fees-to-trading-as-transactions-fall-more-than-40",
    blocks: [
      {
        type: "p",
        text: "CoinDesk counted the week of 2–8 October against the week of 10–16 September. The chain averaged 6.2 million transactions a day, down from 10.8 million. That is a drop of about 42 percent. Daily active addresses fell about 31 percent, to roughly 322,000.",
      },
      {
        type: "p",
        text: "Spot trading for that October week was about $7.45 billion, down from $9.46 billion the week before. Uniswap handled most of it. Perpetual futures went the other way: about $7.35 billion on a rolling week, up about 26 percent.",
      },
      {
        type: "quote",
        text: "The money is still in the room. The footsteps are fewer.",
      },
      {
        type: "h",
        text: "What held",
      },
      {
        type: "p",
        text: "Deposits in the lending and trading apps were still about $1.04 billion, a little higher than the week before. Stablecoins on the chain sat near $1.10 billion. People did not empty the table. They traded less of what was on it.",
      },
      {
        type: "p",
        text: "Network fees paid by users were about $65,000 a day in that October week, down about 39 percent from the week before. The busiest day in early September had taken in about $8 million. Robinhood keeps most of the chain fee, so a quiet week is a quieter till for the chain itself.",
      },
      {
        type: "h",
        text: "The holiday",
      },
      {
        type: "p",
        text: "Robinhood pays the network fee on wallet swaps over fifty cents. That offer was due to end on 29 September. It now runs through 31 December 2026. After that, the swapper pays the chain.",
      },
      {
        type: "p",
        text: "This is a count of what already happened. It is not a forecast, and it is not a reason to buy or sell anything.",
      },
    ],
  },
  {
    slug: "a-key-is-a-pass",
    date: "11 Oct 2026",
    kicker: "Keys",
    title: "A key is a pass, not a person.",
    lede: "BaseFriend sells keys to Farcaster creators and clubs. DEGEN pays, on Base. The chat is the point. A listed name may not have joined.",
    image: "forest.webp",
    source: "BaseFriend",
    href: "https://basefriend.tech/",
    blocks: [
      {
        type: "p",
        text: "BaseFriend is a keys room built by @chef. You pick a creator or a club, buy a whole number of keys, and the key is the pass into that chat. Payment is DEGEN. Gas is ETH. Both sit on Base, which is a different chain from Robinhood Chain.",
      },
      {
        type: "quote",
        text: "A key opens a room. It does not hand you the person.",
      },
      {
        type: "h",
        text: "What the key is",
      },
      {
        type: "p",
        text: "Every creator and every club is a market inside one shared contract, BaseFriendMarket, at 0x2df05c3238f5d1edf8c03ff78698ff41b84f3997. The keys are ERC-1155 units. DEGEN, the token that pays, is 0x4ed4e862860bed51a9570b96d89af5e1b0efefed. A price comes from a bonding curve: more keys out, the next one costs more. A sale walks the price back down. Buys and sells both take a 10 percent fee on the curve amount, on top of gas.",
      },
      {
        type: "p",
        text: "Club keyholders can share an encrypted group chat. A creator chat opens after that creator claims the one reserved Genesis key. Until then, the name can sit on the list without the person having joined or endorsed the app.",
      },
      {
        type: "h",
        text: "What it is not",
      },
      {
        type: "p",
        text: "A key is not a share of the creator, the club, or a business. Staking a key can put you in line for a cut of later trading fees, and each stake locks for seven days. That cut depends on other trades and other stakes. It can be nothing. The app says prices can fall, and that a displayed yield is not a return. Genesis claims are still locked until BaseFriend announces them.",
      },
      {
        type: "p",
        text: "On this street, Keys is the door. The pixel and the practice desk stay on their own chains. A key does not mint a seat, and a seat does not buy a key.",
      },
    ],
  },
  {
    slug: "t-rowe",
    date: "9 Oct 2026",
    kicker: "Robinhood",
    title: "A fund manager walked in. Nothing has launched.",
    lede: "Robinhood is talking with T. Rowe Price about a Stock Token tied to an actively managed fund. There is no ticker, no date, and no promise it ships.",
    image: "coin.webp",
    source: "Unchained",
    href: "https://unchainedcrypto.com/robinhood-explores-stock-token-tied-to-t-rowe-price-actively-managed-etf/",
    blocks: [
      {
        type: "p",
        text: "On 9 October 2026 Robinhood Crypto said it is exploring a Stock Token linked to an actively managed ETF, with T. Rowe Price, on Robinhood Chain. T. Rowe Price has reported about $1.9 trillion in client assets. Robinhood called it the first Stock Token of its kind, if the work succeeds.",
      },
      {
        type: "quote",
        text: "A conversation is not a product.",
      },
      {
        type: "p",
        text: "No fund was named. No launch date was named. No list of countries was named. Robinhood said the work still needs a legal review, a board, final terms, and a regulator. The company also said no assurance can be given that those approvals arrive.",
      },
      {
        type: "h",
        text: "What a Stock Token is",
      },
      {
        type: "p",
        text: "Robinhood describes Stock Tokens as debt securities from Robinhood Assets in Jersey. A holder gets economic exposure to a stock or a fund. The holder does not get the share, the vote, or a claim on the company that issued the stock. The tokens are not offered to people in the United States. Canada, the United Kingdom, and Switzerland are outside the offer too, along with other places listed in the prospectus.",
      },
      {
        type: "p",
        text: "The wallet already lists more than 190 of these tokens, tied to names such as NVIDIA, Apple, Alphabet, and QQQ. An actively managed fund would be a new shape of the same debt token. It would still not make the holder a shareholder of the fund.",
      },
    ],
  },
  {
    slug: "pixel-is-on",
    date: "11 Oct 2026",
    kicker: "NFT",
    title: "The pixel is on.",
    lede: "TICKPIX is a public mint on Robinhood Chain. A seat is a picture. The contract counts them. The picture does not pay you.",
    image: "seed.webp",
    source: "The contract",
    href: "https://nft.aibusiness.fun/",
    blocks: [
      {
        type: "p",
        text: "An NFT here is a token with a number and an owner. The contract remembers both. TICKPIX is that idea drawn as a pixel. The set stops at 4,663. The public price is 0.0001 ETH. One wallet can take five. Gas is ETH on chain 4663.",
      },
      {
        type: "quote",
        text: "A seat is a picture with a name on it. That is the whole trick, and it is a real one.",
      },
      {
        type: "h",
        text: "What the mint can do",
      },
      {
        type: "p",
        text: "The phase is public, so a wallet can mint without an old allowlist. The site reads the phase and the count from the chain before you connect. The mint itself still waits for a confirmation. Cancel, and the seat stays where it was.",
      },
      {
        type: "p",
        text: "The floor keeps the live count and the newest owners. Come back when that number moves. The picture does not earn a fee, and it is not a share of anything. Holding pixel 19 does not make you a shareholder of Robinhood, of $HOOD, or of this street.",
      },
      {
        type: "h",
        text: "What a builder can hang on it",
      },
      {
        type: "p",
        text: "Because the contract knows the owner, another contract can ask. A gate can open for holders. A gallery can point at the image. A game can check the wallet. None of that is built into the pixel itself. The pixel is the keyhole. Someone still has to build the door.",
      },
    ],
  },
  {
    slug: "what-the-rails-hold",
    date: "11 Oct 2026",
    kicker: "The build",
    title: "What the rails can hold.",
    lede: "A fast chain, a token that tracks a stock, a dollar that can move, and a picture with an owner. That is the kit. It has edges.",
    image: "bow.webp",
    source: "Robinhood",
    href: "https://robinhood.com/us/en/newsroom/robinhood-accelerates-global-expansion-robinhood-chain-mainnet-stock-tokens-agentic-trading/",
    notes: [
      {
        source: "Crypto Briefing, 18 Sep 2026",
        href: "https://cryptobriefing.com/robinhood-chain-near-intents-cross-chain-swaps/",
      },
      {
        source: "ohmybird, 5 Oct 2026",
        href: "https://www.ohmybird.app/blog/weekly-digest-2026-10-05-robinhood-chain-s-rwa-lending-week",
      },
    ],
    blocks: [
      {
        type: "p",
        text: "Robinhood opened the public mainnet of Robinhood Chain on 1 July 2026. It is a layer 2, built on the Arbitrum stack, aimed at tokens tied to things in the world. Uniswap was there on day one as a public pool. Chainlink was named for prices and data. The blocks are meant to land fast.",
      },
      {
        type: "h",
        text: "A stock, as a token",
      },
      {
        type: "p",
        text: "Stock Tokens are debt securities from Robinhood Assets in Jersey. They track US stocks and ETFs. Eligible wallets in more than 120 countries can trade them through the night on pools such as Uniswap. A split or a dividend can move an on-chain multiplier, so the token's displayed amount can change without a new coin.",
      },
      {
        type: "p",
        text: "The holder does not own the share. There is no vote. The United States, the United Kingdom, Canada, and Switzerland are outside the offer, and so are other places in the prospectus. Read that list before you touch one.",
      },
      {
        type: "quote",
        text: "The rails can carry a price. They do not hand you the company.",
      },
      {
        type: "h",
        text: "What people have already built",
      },
      {
        type: "p",
        text: "A pool can trade the token while the New York shutters are down. A lending desk can take the token as collateral. In the first days of October, Gimbal, Gage, and Pons were reported opening credit against stock tokens. The share stays with the custodian. The token is what you pledge.",
      },
      {
        type: "p",
        text: "USDG, the dollar token, can move across dozens of chains through NEAR Intents. You name the outcome. A solver does the hops. That is a dollar changing rooms without you driving a bridge.",
      },
      {
        type: "h",
        text: "The small build on this street",
      },
      {
        type: "p",
        text: "TICKPIX uses the same kind of rail for a picture. The floor's desk is a practice table: play coins, a pit, a till that can grow from fees and new STONK. Idle earns nothing. None of that is a promise of profit. The practice coins are not Global Dollar.",
      },
      {
        type: "p",
        text: "So the kit is plain. A chain that settles quickly. A token that follows a price. A dollar that can leave the room. A picture the contract can name. Builders can stack a pool, a loan, a gate, or a game on top. The stack still cannot turn a token into a share, or a quiet week into a guarantee.",
      },
    ],
  },
];

export function findPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
