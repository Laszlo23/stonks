import type { Address } from "viem";

export type DeskStatus = "idle" | "onShift" | "listed";
export type Tier = "paper" | "brass" | "ink";
export type Side = "usdg" | "stonk";

export type DeskRow = {
  id: bigint;
  owner: Address;
  status: DeskStatus;
  tier: Tier;
  bagUsdg: bigint;
  bagStonk: bigint;
  shares: bigint;
  pitUsdg: bigint;
  pitStonk: bigint;
  claimable: bigint;
  sizeNow: bigint;
  sizeOpened: bigint;
  seller: Address;
  price: bigint;
};

export function parseStatus(value: number): DeskStatus {
  if (value === 0) return "idle";
  if (value === 1) return "onShift";
  if (value === 2) return "listed";
  throw new Error(`Unknown desk status ${value}`);
}

export function parseTier(value: number): Tier {
  if (value === 0) return "paper";
  if (value === 1) return "brass";
  if (value === 2) return "ink";
  throw new Error(`Unknown desk tier ${value}`);
}

export function tierLabel(tier: Tier): string {
  switch (tier) {
    case "paper":
      return "PAPER";
    case "brass":
      return "BRASS";
    case "ink":
      return "INK";
    default: {
      const exhaustive: never = tier;
      return exhaustive;
    }
  }
}

export function tierNote(tier: Tier): string {
  switch (tier) {
    case "paper":
      return "One share of the new STONK.";
    case "brass":
      return "A quarter more new STONK than paper.";
    case "ink":
      return "Half again the new STONK that paper takes.";
    default: {
      const exhaustive: never = tier;
      return exhaustive;
    }
  }
}

export function statusLabel(status: DeskStatus): string {
  switch (status) {
    case "idle":
      return "Idle";
    case "onShift":
      return "On shift";
    case "listed":
      return "Listed";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

export function sideLabel(side: Side): string {
  switch (side) {
    case "usdg":
      return "USDG";
    case "stonk":
      return "STONK";
    default: {
      const exhaustive: never = side;
      return exhaustive;
    }
  }
}

export function otherSide(side: Side): Side {
  switch (side) {
    case "usdg":
      return "stonk";
    case "stonk":
      return "usdg";
    default: {
      const exhaustive: never = side;
      return exhaustive;
    }
  }
}
