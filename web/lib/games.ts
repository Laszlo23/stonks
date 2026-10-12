export const games = [
  {
    key: "gm",
    label: "Greeting",
    href: "https://gm.aibusiness.fun/",
    line: "Say GM on the real chain. A streak, not a payout.",
  },
  {
    key: "mine",
    label: "Field",
    href: "https://mine.aibusiness.fun/",
    line: "A small field. Three free cuts on this browser.",
  },
  {
    key: "hood",
    label: "Hood",
    href: "https://dex.aibusiness.fun/rfgame",
    line: "Five castles with a Rare Friend. The HOOD on the score is simulated.",
  },
  {
    key: "casino",
    label: "Whale",
    href: "https://playwhale.io/",
    line: "A real-money casino and sportsbook. A bet can be lost.",
  },
] as const;

export type GameKey = (typeof games)[number]["key"];
