"use client";

import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { zeroAddress, type Address } from "viem";
import { deskContract, pitContract, sameAddress, seated, showroomContract } from "./contracts";
import { bagSize } from "./format";
import { parseStatus, parseTier, type DeskRow } from "./types";

const PER_DESK = 6;
const READ_MS = 15_000;

export function useFloor() {
  const next = useReadContract({
    ...deskContract,
    functionName: "nextId",
    query: { enabled: seated, refetchInterval: READ_MS, refetchIntervalInBackground: false },
  });

  const ids = useMemo(() => {
    if (next.data === undefined) return [];
    const count = Number(next.data) - 1;
    return Array.from({ length: count }, (_, index) => BigInt(index + 1));
  }, [next.data]);

  const board = useReadContracts({
    contracts: ids.flatMap((id) => [
      { ...deskContract, functionName: "ownerOf", args: [id] },
      { ...deskContract, functionName: "statusOf", args: [id] },
      { ...deskContract, functionName: "tierOf", args: [id] },
      { ...deskContract, functionName: "bagOf", args: [id] },
      { ...pitContract, functionName: "position", args: [id] },
      { ...showroomContract, functionName: "listing", args: [id] },
    ]),
    query: { enabled: seated && ids.length > 0, refetchInterval: READ_MS, refetchIntervalInBackground: false },
  });

  const desks = useMemo(() => {
    const rows: DeskRow[] = [];
    const results = board.data;
    if (!results) return rows;
    ids.forEach((id, index) => {
      const base = index * PER_DESK;
      const owner = results[base];
      const status = results[base + 1];
      const tier = results[base + 2];
      const bag = results[base + 3];
      const position = results[base + 4];
      const listing = results[base + 5];
      if (!owner || !status || !tier || !bag || !position || !listing) return;
      if (owner.status !== "success" || status.status !== "success" || tier.status !== "success") return;
      if (bag.status !== "success" || position.status !== "success" || listing.status !== "success") return;

      const bagTuple = bag.result as unknown as readonly [bigint, bigint];
      const positionTuple = position.result as unknown as readonly [bigint, bigint, bigint, bigint, bigint, bigint];
      const listingTuple = listing.result as unknown as readonly [Address, bigint];

      rows.push({
        id,
        owner: owner.result as unknown as Address,
        status: parseStatus(Number(status.result)),
        tier: parseTier(Number(tier.result)),
        bagUsdg: bagTuple[0],
        bagStonk: bagTuple[1],
        shares: positionTuple[0],
        pitUsdg: positionTuple[1],
        pitStonk: positionTuple[2],
        claimable: positionTuple[3],
        sizeNow: positionTuple[4],
        sizeOpened: positionTuple[5],
        seller: listingTuple[0] ?? zeroAddress,
        price: listingTuple[1] ?? 0n,
      });
    });
    return rows;
  }, [board.data, ids]);

  return {
    desks,
    ready: seated ? !next.isLoading && (ids.length === 0 || !board.isLoading) : true,
    error: next.error ?? board.error,
    seated,
  };
}

export function held(desk: DeskRow): { usdg: bigint; stonk: bigint } {
  if (desk.status === "onShift") return { usdg: desk.pitUsdg, stonk: desk.pitStonk };
  return { usdg: desk.bagUsdg, stonk: desk.bagStonk };
}

export function tillOf(desk: DeskRow): bigint {
  if (desk.status === "onShift") return desk.sizeNow;
  return bagSize(desk.bagUsdg, desk.bagStonk);
}

export function gainOf(desk: DeskRow): bigint {
  if (desk.status !== "onShift") return 0n;
  if (desk.sizeNow <= desk.sizeOpened) return 0n;
  return desk.sizeNow - desk.sizeOpened;
}

export function isMine(desk: DeskRow, player?: Address): boolean {
  if (!player) return false;
  if (sameAddress(desk.owner, player)) return true;
  return desk.status === "listed" && sameAddress(desk.seller, player);
}
