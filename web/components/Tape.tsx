"use client";

import { zeroAddress } from "viem";
import { useReadContract } from "wagmi";
import { formatAmount } from "@/lib/format";
import { pitContract, seated } from "@/lib/contracts";
import { sideLabel, type Side } from "@/lib/types";
import { useTable } from "@/app/providers";

export function Tape() {
  const { table } = useTable();
  const swap = useReadContract({
    ...pitContract,
    functionName: "lastSwap",
    query: { enabled: seated && table === "anvil", refetchInterval: 2000 },
  });

  let line = "The pit is quiet.";
  if (seated && swap.data) {
    const [trader, usdgIn, amountIn, amountOut] = swap.data;
    if (trader !== zeroAddress && amountIn > 0n) {
      const paid: Side = usdgIn ? "usdg" : "stonk";
      const received: Side = usdgIn ? "stonk" : "usdg";
      line = `${formatAmount(amountIn)} ${sideLabel(paid)} in → ${formatAmount(amountOut)} ${sideLabel(received)} · fee to the floor`;
    }
  }
  if (!seated) line = "The floor has no contracts yet.";
  if (table === "robinhood") line = "Watching Robinhood Chain. The floor is still local.";

  return (
    <div className="border-t border-line">
      <p data-testid="tape" className="mx-auto max-w-6xl px-6 py-2 text-[11px] tracking-[0.08em] text-ink/70">
        {line}
      </p>
    </div>
  );
}
