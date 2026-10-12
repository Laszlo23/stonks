export type WireKind = "alpha" | "street" | "shift";

export type WireItem = {
  kind: WireKind;
  date: string;
  title: string;
  body: string;
  source: string;
  href: string;
};

export const wireItems: WireItem[] = [
  {
    kind: "street",
    date: "12 Oct 2026",
    title: "The room stayed open.",
    body: "StreetHood's all-day space, hosted by Cashpig, ran 18 hours on 11 October. The title was NFTs, memes, and talk. Spaces Dashboard counted 4,919 people through it. The same title was on the air again the morning of 12 October, with Cashpig hosting. A second Robinhood Chain room, market and meme talk, was up beside it. This is a community microphone. HoodStreet says on its own site that it is not part of Robinhood.",
    source: "Spaces Dashboard",
    href: "https://spacesdashboard.com/space/1DGleVPWPbqJL/streethood-media-247-robinhood-nfts-memes-talk-seekers",
  },
  {
    kind: "alpha",
    date: "9 Oct 2026",
    title: "A listing is the rumor.",
    body: "On 1 October, Vlad Tenev told The Rollup the chain would not pick winners. Foresight, writing on 9 October, said the room had wanted an official bag and heard a no. People also read a Pons mark on the HOOD Summit screen as a promotion. A mark on a screen is not a listing. On 3 October, Bonk Guy wrote that the quiet patch came from names that had run too far, money going back to Solana, and Robinhood not listing ecosystem tokens. He said a listing would start the room again. That is his hope. Robinhood has not said it will.",
    source: "Foresight News",
    href: "https://www.aicoin.com/en/article/554732",
  },
  {
    kind: "street",
    date: "12 Oct 2026",
    title: "The day got quieter.",
    body: "As of 12 October, Pond Street read $1.06 billion locked, up 1.5 percent on the week, and $574 million of DEX volume in a day, down 40.2 percent on the week. That day was about 54 percent of everything locked. Since the chain opened, 617,936 tokens got a market. Of those past their first week, about 1 in 296 was still trading. The chain was minting about 6,060 new tokens a day.",
    source: "Pond Street Ledger",
    href: "https://www.pondstreetledger.com/robinhood-chain/state-of-the-chain",
  },
  {
    kind: "alpha",
    date: "11 Oct 2026",
    title: "The night told the open.",
    body: "The IMF read the five busiest tokenized US stocks, including Nvidia and Tesla. More than half the trading happened while US exchanges were shut. About 80 percent of trades were for less than one share. Five minutes after the open, the regular shares had taken in more than 85 percent of the overnight move. The tokens were about 1.5 times as jumpy, and thinner. Tokenized equities were about $2.3 billion inside a $65 billion tokenized-asset market.",
    source: "CoinDesk",
    href: "https://www.coindesk.com/business/2026/10/11/imf-finds-demand-for-tokenized-stocks-says-the-market-is-still-volatile-illiquid",
  },
  {
    kind: "alpha",
    date: "6 Oct 2026",
    title: "September belonged to Robinhood.",
    body: "CoinDesk counted $15.6 billion of on-chain tokenized-equity trading in September, a record, up 16.4 percent. Robinhood was the largest venue. Volume rose 407 percent to $6.57 billion, a 42 percent share, from 9.7 percent in August. Tokenized stocks grew 13.7 percent to $4.87 billion. A busy month is not a deep market. A Stock Token tracks a price. It does not make the holder a shareholder.",
    source: "CoinDesk",
    href: "https://www.coindesk.com/research/stablecoins-and-tokenized-assets-report-october-2026",
  },
  {
    kind: "street",
    date: "11 Oct 2026",
    title: "Most new tokens stop being traded.",
    body: "As of 11 October, Pond Street counted $1.06 billion locked and $582 million of DEX volume in a day, about 55 percent of the deposits turning over. Since the chain opened, 617,936 tokens got a market. Of those past their first week, about 1 in 296 was still trading.",
    source: "Pond Street Ledger",
    href: "https://www.pondstreetledger.com/robinhood-chain/state-of-the-chain",
  },
  {
    kind: "shift",
    date: "8 Oct 2026",
    title: "A share, with the rights kept.",
    body: "Securitize put 12 US stocks on Solana, including Apple, Nvidia, and Tesla. Each token is backed by a share and is meant to keep dividends and a vote. It is a security entitlement, not a line on the company's register. Trading starts on their platform in USDC. A seat on the NYSE's planned 24-hour venue, and on the OKX and ICE venue, is still a plan.",
    source: "CoinDesk",
    href: "https://www.coindesk.com/business/2026/10/08/securitize-brings-apple-nvidia-and-tesla-to-solana-with-nyse-trading-in-the-works",
  },
  {
    kind: "alpha",
    date: "10 Oct 2026",
    title: "The chain slowed. The money stayed.",
    body: "CoinDesk counted 6.2 million transactions a day in the first week of October, down from 10.8 million in mid-September. Deposits in the apps were still about $1.04 billion. Perpetual volume rose. Robinhood pays the network fee on wallet swaps over fifty cents through 31 December.",
    source: "CoinDesk",
    href: "https://www.coindesk.com/markets/2026/10/10/robinhood-chain-slowdown-spreads-from-fees-to-trading-as-transactions-fall-more-than-40",
  },
  {
    kind: "alpha",
    date: "9 Oct 2026",
    title: "T. Rowe Price is in the room. Nothing has launched.",
    body: "Robinhood is exploring a Stock Token tied to an actively managed fund with T. Rowe Price, which reported about $1.9 trillion under management. The talks still need a lawyer, a board, and a regulator. There is no ticker and no date.",
    source: "Robinhood",
    href: "https://chainarticles.news/robinhood-explores-tokenized-etf-with-1-9t-t-rowe-price/",
  },
  {
    kind: "street",
    date: "9 Oct 2026",
    title: "A stock now trades as a token.",
    body: "Robinhood Assets in Jersey issued Stock Tokens that track US equities. They are debt tokens. Holding one does not make you a shareholder, and it carries no vote. Secondary trading runs through the night. The US, UK, Canada, and Switzerland are outside the offer. Chainlink prices the token. A split or a dividend moves an on-chain multiplier.",
    source: "Robinhood docs",
    href: "https://basisdesk.news/news/robinhood-unveils-stock-tokens-onchain",
  },
  {
    kind: "street",
    date: "8 Oct 2026",
    title: "One NVDA pool cleared a pile.",
    body: "A young NVDA pool against SUSD on Uniswap v4 was reported near $123 million in a day, on a few hundred trades. SPY is the other shape: many pools, stock against stock. The wallet can route about 190 stock tokens.",
    source: "RobinSwap",
    href: "https://robinswap.trade/news/robinhood-chain-pools-flow/",
  },
  {
    kind: "shift",
    date: "18 Sep 2026",
    title: "The dollar moved without a bridge.",
    body: "NEAR Intents lets USDG and ether-side assets swap across more than 180 names and 30 chains. You name the outcome. The hops belong to the solver.",
    source: "Crypto Briefing",
    href: "https://cryptobriefing.com/robinhood-chain-near-intents-cross-chain-swaps/",
  },
  {
    kind: "shift",
    date: "2 Oct 2026",
    title: "Credit showed up against the token.",
    body: "In one week, Gimbal, Gage, and Pons opened loans against stock tokens. Gimbal slices a loan across lenders. Gage skips the liquidation. The share stays with the custodian. The token is what you pledge.",
    source: "ohmybird",
    href: "https://www.ohmybird.app/blog/weekly-digest-2026-10-05-robinhood-chain-s-rwa-lending-week",
  },
];

export function wireTitle(kind: WireKind): string {
  switch (kind) {
    case "alpha":
      return "Alpha";
    case "street":
      return "On the street";
    case "shift":
      return "The change";
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}
