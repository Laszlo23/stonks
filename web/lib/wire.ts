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
