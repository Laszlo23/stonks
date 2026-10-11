"use client";

import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { night } from "@/lib/art";
import { tokenAbi } from "@/lib/abi";
import { addresses, pitContract, seated } from "@/lib/contracts";
import { formatAmount, parseAmount, toInput } from "@/lib/format";
import { otherSide, sideLabel, type Side } from "@/lib/types";
import { useMoves } from "@/lib/useMoves";

export default function PitPage() {
  const [side, setSide] = useState<Side>("usdg");
  const [text, setText] = useState("");
  const { address } = useAccount();
  const { pending, error, move, send, approve } = useMoves();
  const amount = parseAmount(text);
  const usdgIn = side === "usdg";
  const payToken = side === "usdg" ? addresses.usdg : addresses.stonk;

  const quote = useReadContract({
    ...pitContract,
    functionName: "quote",
    args: [usdgIn, amount ?? 0n],
    query: { enabled: seated && amount !== null && amount > 0n, refetchInterval: 2000 },
  });
  const reservesU = useReadContract({
    ...pitContract,
    functionName: "reserveUsdg",
    query: { enabled: seated, refetchInterval: 2000 },
  });
  const reservesS = useReadContract({
    ...pitContract,
    functionName: "reserveStonk",
    query: { enabled: seated, refetchInterval: 2000 },
  });
  const balance = useReadContract({
    address: payToken,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: seated && Boolean(address), refetchInterval: 2000 },
  });

  const amountOut = quote.data?.[0] ?? 0n;
  const fee = quote.data?.[1] ?? 0n;
  const canSwap = seated && amount !== null && amount > 0n && amountOut > 0n && pending === null;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,28rem)_1fr]">
      <div>
      <p className="label">The pit</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight">Swap</h1>
      <p className="mt-4 text-lg leading-relaxed">0.30% stays in the pit for desks on shift.</p>
      <div className="panel mt-8 p-6">
        <div className="flex items-center justify-between">
          <label className="text-[11px] tracking-[0.16em]" htmlFor="swap-input">
            YOU PAY {sideLabel(side)}
          </label>
          <button
            type="button"
            className="text-[11px] tracking-[0.12em] text-brass"
            onClick={() => {
              if (balance.data !== undefined) setText(toInput(balance.data));
            }}
          >
            MAX
          </button>
        </div>
        <input
          id="swap-input"
          data-testid="swap-input"
          inputMode="decimal"
          value={text}
          placeholder="0"
          onChange={(event) => setText(event.target.value)}
          className="mt-2 w-full bg-transparent font-serif text-5xl tabular outline-none"
        />
        <p className="mt-2 text-[11px] tabular text-ink/50">
          Wallet {formatAmount(balance.data ?? 0n)} {sideLabel(side)}
        </p>
        <button
          type="button"
          data-testid="swap-flip"
          className="mt-6 text-[11px] tracking-[0.16em] text-brass"
          onClick={() => setSide((current) => otherSide(current))}
        >
          SWITCH TO {sideLabel(otherSide(side))}
        </button>
        <p className="mt-6 text-[11px] tracking-[0.16em] text-ink/50">YOU RECEIVE {sideLabel(otherSide(side))}</p>
        <p data-testid="swap-output" className="mt-2 font-serif text-5xl tabular">
          {amount && amount > 0n ? formatAmount(amountOut) : "0.00"}
        </p>
        <p className="mt-4 text-[11px] leading-relaxed text-ink/70">
          {fee > 0n ? `This swap leaves ${formatAmount(fee)} ${sideLabel(side)} with the floor.` : "The fee stays with the desks."}
        </p>
        <button
          type="button"
          data-testid="swap-button"
          disabled={!canSwap}
          className="btn-neon mt-6 w-full"
          onClick={() => {
            if (amount === null || amount === 0n) return;
            const minOut = (amountOut * 99n) / 100n;
            move("Swapping…", async () => {
              await approve(payToken, addresses.pit, amount);
              await send({
                ...pitContract,
                functionName: "swap",
                args: [usdgIn, amount, minOut],
              });
            });
          }}
        >
          {pending === "Swapping…" ? "Swapping…" : "Swap"}
        </button>
        {error ? <p className="mt-3 text-[11px]">{error}</p> : null}
      </div>
      <p className="mt-6 text-[11px] tabular leading-relaxed text-ink/60">
        Pit holds {formatAmount(reservesU.data ?? 0n)} USDG and {formatAmount(reservesS.data ?? 0n)} STONK.
      </p>
      </div>
      <aside className="panel overflow-hidden">
        <img src={night("pool.webp")} alt="" className="h-72 w-full object-cover lg:h-[28rem]" />
        <div className="p-6">
          <p className="label">The pool</p>
          <p className="mt-3 leading-relaxed text-ink/80">
            Desks on shift sit in this water. A swap ripples the bag. The fee stays with whoever is working.
          </p>
        </div>
      </aside>
    </div>
  );
}
