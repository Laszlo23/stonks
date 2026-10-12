import { getAddress, isAddress, type Address } from "viem";

export const socialKinds = ["x", "farcaster", "telegram", "site"] as const;

export type SocialKind = (typeof socialKinds)[number];

export type Socials = Record<SocialKind, string>;

export type MemberCard = {
  address: Address;
  name: string;
  line: string;
  socials: Socials;
  links: Address[];
  at: string;
};

export type Bond = "you" | "both" | "out" | "in" | "none";

const CARD_HEAD = "Night Ledger member card";
const LINK_HEAD = "Night Ledger member link";

export function emptySocials(): Socials {
  return { x: "", farcaster: "", telegram: "", site: "" };
}

export function socialLabel(kind: SocialKind): string {
  switch (kind) {
    case "x":
      return "X";
    case "farcaster":
      return "Farcaster";
    case "telegram":
      return "Telegram";
    case "site":
      return "Site";
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

export function socialHref(kind: SocialKind, value: string): string {
  switch (kind) {
    case "x":
      return `https://x.com/${encodeURIComponent(value)}`;
    case "farcaster":
      return `https://farcaster.xyz/${encodeURIComponent(value)}`;
    case "telegram":
      return `https://t.me/${encodeURIComponent(value)}`;
    case "site":
      return value;
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

export function socialText(kind: SocialKind, value: string): string {
  switch (kind) {
    case "x":
    case "farcaster":
    case "telegram":
      return `@${value}`;
    case "site":
      return siteHost(value);
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

export function cardMessage(input: { address: Address; name: string; line: string; socials: Socials; at: number }): string {
  return [
    CARD_HEAD,
    `wallet: ${input.address}`,
    `name: ${input.name}`,
    `line: ${input.line}`,
    `x: ${input.socials.x}`,
    `farcaster: ${input.socials.farcaster}`,
    `telegram: ${input.socials.telegram}`,
    `site: ${input.socials.site}`,
    `at: ${input.at}`,
  ].join("\n");
}

export function linkMessage(input: { address: Address; other: Address; on: boolean; at: number }): string {
  return [LINK_HEAD, `wallet: ${input.address}`, `other: ${input.other}`, `on: ${input.on ? "yes" : "no"}`, `at: ${input.at}`].join("\n");
}

export function readCardMessage(message: string): { address: Address; name: string; line: string; socials: Socials; at: number } | null {
  const lines = message.split("\n");
  if (lines.length !== 9 || lines[0] !== CARD_HEAD) return null;
  const wallet = field(lines[1], "wallet");
  const name = field(lines[2], "name");
  const line = field(lines[3], "line");
  const x = field(lines[4], "x");
  const farcaster = field(lines[5], "farcaster");
  const telegram = field(lines[6], "telegram");
  const site = field(lines[7], "site");
  const at = field(lines[8], "at");
  if (wallet === null || name === null || line === null || x === null || farcaster === null || telegram === null || site === null || at === null) {
    return null;
  }
  const address = walletAddress(wallet);
  const socials = cleanSocials({ x, farcaster, telegram, site });
  const stamp = cleanStamp(at);
  const nameText = cleanName(name);
  const lineText = cleanLine(line);
  if (!address || !socials || stamp === null || !nameText || lineText === null) return null;
  return { address, name: nameText, line: lineText, socials, at: stamp };
}

export function readLinkMessage(message: string): { address: Address; other: Address; on: boolean; at: number } | null {
  const lines = message.split("\n");
  if (lines.length !== 5 || lines[0] !== LINK_HEAD) return null;
  const wallet = field(lines[1], "wallet");
  const otherRaw = field(lines[2], "other");
  const onRaw = field(lines[3], "on");
  const at = field(lines[4], "at");
  if (wallet === null || otherRaw === null || onRaw === null || at === null) return null;
  const address = walletAddress(wallet);
  const other = walletAddress(otherRaw);
  const stamp = cleanStamp(at);
  if (!address || !other || stamp === null) return null;
  if (onRaw !== "yes" && onRaw !== "no") return null;
  if (address.toLowerCase() === other.toLowerCase()) return null;
  return { address, other, on: onRaw === "yes", at: stamp };
}

export function freshStamp(at: number, now = Date.now()): boolean {
  const skew = Math.abs(now - at * 1000);
  return skew <= 10 * 60 * 1000;
}

export function bond(me: Address | null, card: MemberCard, all: MemberCard[]): Bond {
  if (!me) return "none";
  if (same(me, card.address)) return "you";
  const mine = all.find((item) => same(item.address, me));
  const outward = mine?.links.some((item) => same(item, card.address)) ?? false;
  const inward = card.links.some((item) => same(item, me));
  if (outward && inward) return "both";
  if (outward) return "out";
  if (inward) return "in";
  return "none";
}

export function bondLabel(kind: Bond): string {
  switch (kind) {
    case "you":
      return "You";
    case "both":
      return "Linked";
    case "out":
      return "You linked them";
    case "in":
      return "They linked you";
    case "none":
      return "Not linked";
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

export function shortWallet(address: Address): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function same(left: string, right: string): boolean {
  return left.toLowerCase() === right.toLowerCase();
}

function field(line: string, key: string): string | null {
  const prefix = `${key}: `;
  if (!line.startsWith(prefix)) return null;
  return line.slice(prefix.length);
}

function walletAddress(value: string): Address | null {
  if (!isAddress(value)) return null;
  return getAddress(value);
}

function cleanStamp(value: string): number | null {
  if (!/^\d{10}$/.test(value)) return null;
  const at = Number(value);
  return Number.isFinite(at) ? at : null;
}

function cleanName(value: string): string | null {
  const name = value.trim().replace(/\s+/g, " ");
  if (name.length < 1 || name.length > 24) return null;
  if (!/^[\p{L}\p{N}][\p{L}\p{N} .'-]*$/u.test(name)) return null;
  return name;
}

function cleanLine(value: string): string | null {
  const line = value.trim().replace(/\s+/g, " ");
  if (line.length > 96) return null;
  if (line.length > 0 && /[\u0000-\u001f]/.test(line)) return null;
  return line;
}

function cleanSocials(input: Socials): Socials | null {
  const socials = emptySocials();
  for (const kind of socialKinds) {
    const clean = cleanSocial(kind, input[kind]);
    if (clean === null) return null;
    socials[kind] = clean;
  }
  return socials;
}

function cleanSocial(kind: SocialKind, value: string): string | null {
  const handle = value.trim();
  if (handle.length === 0) return "";
  switch (kind) {
    case "x":
      return /^[A-Za-z0-9_]{1,15}$/.test(handle.replace(/^@/, "")) ? handle.replace(/^@/, "") : null;
    case "farcaster":
      return /^[a-z0-9][a-z0-9-]{0,15}$/.test(handle.replace(/^@/, "").toLowerCase())
        ? handle.replace(/^@/, "").toLowerCase()
        : null;
    case "telegram":
      return /^[A-Za-z0-9_]{4,32}$/.test(handle.replace(/^@/, "")) ? handle.replace(/^@/, "") : null;
    case "site":
      return cleanSite(handle);
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

function cleanSite(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password || !url.hostname) return null;
  if (url.href.length > 120) return null;
  return url.href;
}

function siteHost(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}
