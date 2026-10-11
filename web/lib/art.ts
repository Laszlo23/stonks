import type { Tier } from "./types";

export function night(file: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}/night/${file}`;
}

export function tierArt(tier: Tier): string {
  switch (tier) {
    case "paper":
      return night("desk-paper.webp");
    case "brass":
      return night("desk-brass.webp");
    case "ink":
      return night("desk-ink.webp");
    default: {
      const exhaustive: never = tier;
      return exhaustive;
    }
  }
}
