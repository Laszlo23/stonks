import type { Metadata } from "next";

export const origin = "https://doghood.aibusiness.fun/floor";
const card = `${origin}/og.png`;

export const shares = {
  floor: {
    path: "/",
    title: "The Floor",
    text: "The pixel is on. The tape reads Robinhood Chain. The desk is practice. The guide says which is which.",
  },
  guide: {
    path: "/guide",
    title: "How this works",
    text: "Plain guide. What is real, what is practice, and what to tap.",
  },
  wire: {
    path: "/wire",
    title: "The wire",
    text: "What Robinhood Chain is doing. Live numbers, a date, and a source on every note.",
  },
  blog: {
    path: "/blog",
    title: "The blog",
    text: "Night Paper. Robinhood, the pixel, and what the rails can hold. Dated notes. Linked sources.",
  },
  pit: {
    path: "/pit",
    title: "The pit",
    text: "A practice swap. Play coins. Your wallet confirms every move.",
  },
  showroom: {
    path: "/showroom",
    title: "The showroom",
    text: "Practice desks for sale. The bag and the tier come with the seat.",
  },
  keys: {
    path: "/keys",
    title: "A pass",
    text: "A practice pass to a desk. Play USDG. Holding it earns nothing.",
  },
  members: {
    path: "/members",
    title: "Members",
    text: "A card with the socials you choose. A link is a hello. It earns nothing, and it is not a share.",
  },
  names: {
    path: "/names",
    title: "A name",
    text: "A .hood name points at a wallet. Holding it earns nothing. If the parent lapses, it stops resolving.",
  },
  stock: {
    path: "/stock",
    title: "Stock tokens",
    text: "A Stock Token tracks a price. It does not make the holder a shareholder.",
  },
  desk: {
    path: "/desk",
    title: "A desk",
    text: "A practice desk on the floor. Play coins. Your wallet confirms every move.",
  },
} as const;

export type ShareKey = keyof typeof shares;

export function shareUrl(key: ShareKey): string {
  const path = shares[key].path;
  return path === "/" ? origin : `${origin}${path}`;
}

export function shareTitle(key: ShareKey): string {
  return key === "floor" ? "The Floor · Night Ledger" : `${shares[key].title} · The Floor`;
}

export function pageMeta(key: ShareKey): Metadata {
  const item = shares[key];
  const url = shareUrl(key);
  const title = shareTitle(key);
  return {
    title: item.title,
    description: item.text,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: item.text,
      url,
      images: [{ url: card, width: 1200, height: 630, alt: title, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: item.text,
      images: [card],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": card,
      "fc:frame:button:1": "Open",
      "fc:frame:button:1:action": "link",
      "fc:frame:button:1:target": url,
    },
  };
}
