import { night } from "./art";
import type { DeskStatus, Tier } from "./types";

export const floorLead =
  "Pick one thing. Take a pixel seat on the real chain, read today's numbers, or practice a desk with play coins. The guide says what each one is, in plain words.";

export const chapters = [
  {
    key: "coin",
    src: night("coin.webp"),
    kicker: "01 · The coin",
    title: "Two coins, or no shift",
    body: "On this table, USDG plays the dollar. STONK is the other half of the bag. Draw both here, then put both in. One coin alone cannot open a shift. The till is the size of the pair, and it only moves while the desk is on the clock.",
  },
  {
    key: "bow",
    src: night("bow.webp"),
    kicker: "02 · The bow",
    title: "Your wallet draws it",
    body: "Nothing on this floor signs itself. Mint, approve, stock, swap, claim, buy. Each one waits for a confirmation in your wallet. Cancel, and the night stays where it was. The desk does not move your coins for you.",
  },
  {
    key: "seed",
    src: night("seed.webp"),
    kicker: "03 · The seed",
    title: "Only the working desks grow",
    body: "Open the shift and the bag is planted in the pit. Swap fees grow the till. A slow mint of STONK pays the desks still seated. Paper takes one share. Brass takes a quarter more. Ink takes half again. Close the shift and the seed stops.",
  },
  {
    key: "street",
    src: night("street.webp"),
    kicker: "04 · The street",
    title: "The seat sells with the bag",
    body: "This is one room of Night Ledger. Hood Street kept the street. The showroom sells the desk and the coins inside it together. The buyer gets the seat, the bag, and the tier. The work starts again when they open a shift.",
  },
] as const;

export const steps = [
  {
    n: "01",
    title: "Connect",
    body: "Bring your own wallet. The bow draws only when you confirm.",
  },
  {
    n: "02",
    title: "Draw",
    body: "Take 10,000 practice USDG and 10,000 STONK. They exist only on this table. That is enough to stock a bag.",
  },
  {
    n: "03",
    title: "Mint",
    body: "The chain rolls the seat. Most desks are paper. Some are brass. A few are ink.",
  },
  {
    n: "04",
    title: "Stock",
    body: "Put both coins in. If the mix is off the pit, the extra comes back when the shift opens.",
  },
  {
    n: "05",
    title: "Open the shift",
    body: "The bag is now the pit. Idle earns nothing. On shift, the till can rise.",
  },
  {
    n: "06",
    title: "Claim, or sell",
    body: "Claim the waiting STONK. Or close the shift and list the desk, bag and all.",
  },
] as const;

export const pitTale =
  "The pit is the pool. Desks on shift are the water. Pay USDG and receive STONK, or turn it around. Three tenths of one percent never leaves. It stays in the water, and every working till feels the ripple.";

export const showroomTale =
  "A listed desk is off the clock. The bag does not spill, and it does not earn. Pay the ask in USDG and the seat is yours, coins and tier included. Open a shift when you want the seed growing again.";

export function tierTale(tier: Tier): string {
  switch (tier) {
    case "paper":
      return "The common seat. About seventy desks in a hundred roll paper. When new STONK is paid, this bag takes one share for its size.";
    case "brass":
      return "A rarer seat. About one desk in four. The same bag takes a quarter more of the new STONK than paper.";
    case "ink":
      return "The rare seat. About one desk in twenty. The same bag takes half again what paper takes. The roll is final.";
    default: {
      const exhaustive: never = tier;
      return exhaustive;
    }
  }
}

export function deskTale(status: DeskStatus, mine: boolean, stocked: boolean): string {
  switch (status) {
    case "onShift":
      return mine
        ? "You are on the clock. Swaps feed the till. Claim takes the waiting STONK into your wallet. Close the shift before you stock the bag or put the desk up for sale."
        : "Someone else is working this seat. The till moves when the pit moves. The waiting STONK belongs to them.";
    case "idle":
      return stocked
        ? "The bag is full and the desk is idle. Idle earns nothing. Open the shift and the seed starts."
        : "The seat is quiet. Stock USDG and STONK, then open the shift. Until both coins are in, it cannot work.";
    case "listed":
      return mine
        ? "The desk is in the showroom. The bag is locked inside at this ask. Take it back if you want the seat again."
        : "This seat is for sale, bag included. Buy it in the showroom and the tier comes with it.";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
