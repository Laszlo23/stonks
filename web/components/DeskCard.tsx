"use client";

import Link from "next/link";
import { tierArt } from "@/lib/art";
import { pitContract, showroomContract } from "@/lib/contracts";
import { deskNumber, formatAmount } from "@/lib/format";
import { statusLabel, tierLabel, tierNote, type DeskRow } from "@/lib/types";
import { gainOf, held, tillOf } from "@/lib/useFloor";
import { useMoves } from "@/lib/useMoves";

export function DeskCard({ desk, quiet = false }: { desk: DeskRow; quiet?: boolean }) {
  const bag = held(desk);
  const till = tillOf(desk);
  const gain = gainOf(desk);
  const { pending, error, move, send } = useMoves();
  const id = desk.id.toString();
  const stocked = bag.usdg > 0n && bag.stonk > 0n;
  const busy = pending !== null;

  return (
    <article
      data-testid={`desk-card-${id}`}
      className={`panel flex flex-col overflow-hidden ${desk.status === "onShift" ? "sitting" : ""}`}
    >
      <div className="relative">
        <img src={tierArt(desk.tier)} alt="" width={640} height={640} loading="lazy" decoding="async" className="h-48 w-full object-cover" />
        <p className="chip absolute right-3 top-3">{tierLabel(desk.tier)}</p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between">
          <Link href={`/desk?id=${id}`} className="font-serif text-2xl tracking-tight">
            Desk {deskNumber(desk.id)}
          </Link>
          <p className="text-[11px] tracking-[0.14em] text-ink/60">{statusLabel(desk.status).toUpperCase()}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{tierNote(desk.tier)}</p>
        <p data-testid={`till-${id}`} className="mt-5 font-serif text-[2.6rem] leading-none tabular tracking-tight">
          {formatAmount(till)}
        </p>
        <p className="mt-1 text-[11px] tracking-[0.14em] text-ink/50">TILL</p>
        {gain > 0n ? (
          <p data-testid={`gain-${id}`} className="mt-2 text-sm text-gain tabular">
            +{formatAmount(gain)} from fees
          </p>
        ) : (
          <p className="mt-2 text-sm text-transparent">—</p>
        )}
        <dl className="mt-5 space-y-1 text-sm tabular">
          <div className="flex justify-between">
            <dt className="text-ink/50">USDG</dt>
            <dd>{formatAmount(bag.usdg)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/50">STONK</dt>
            <dd>{formatAmount(bag.stonk)}</dd>
          </div>
        </dl>
        {desk.status === "onShift" ? (
          <p className="mt-4 text-[11px] tabular text-ink/60">{formatAmount(desk.claimable)} STONK waiting</p>
        ) : null}
        {desk.status === "listed" ? (
          <p className="mt-4 text-[11px] tabular text-ink/60">Asked {formatAmount(desk.price)} USDG</p>
        ) : null}
        {quiet ? null : (
          <div className="mt-5 flex flex-col gap-2">
            {desk.status === "onShift" ? (
              <>
                <button
                  type="button"
                  data-testid={`shift-${id}`}
                  disabled={busy}
                  className="btn-neon"
                  onClick={() =>
                    move("Closing…", async () => {
                      await send({ ...pitContract, functionName: "closeShift", args: [desk.id] });
                    })
                  }
                >
                  {pending === "Closing…" ? "Closing…" : "Close shift"}
                </button>
                <button
                  type="button"
                  data-testid={`claim-${id}`}
                  disabled={busy || desk.claimable === 0n}
                  className="btn-ghost"
                  onClick={() =>
                    move("Claiming…", async () => {
                      await send({ ...pitContract, functionName: "claim", args: [desk.id] });
                    })
                  }
                >
                  {pending === "Claiming…" ? "Claiming…" : "Claim"}
                </button>
              </>
            ) : null}
            {desk.status === "idle" && stocked ? (
              <button
                type="button"
                data-testid={`shift-${id}`}
                disabled={busy}
                className="btn-neon"
                onClick={() =>
                  move("Opening…", async () => {
                    await send({ ...pitContract, functionName: "openShift", args: [desk.id] });
                  })
                }
              >
                {pending === "Opening…" ? "Opening…" : "Open shift"}
              </button>
            ) : null}
            {desk.status === "idle" && !stocked ? (
              <Link href={`/desk?id=${id}`} data-testid={`stock-${id}`} className="btn-ghost">
                Stock the bag
              </Link>
            ) : null}
            {desk.status === "listed" ? (
              <button
                type="button"
                data-testid={`cancel-${id}`}
                disabled={busy}
                className="btn-ghost"
                onClick={() =>
                  move("Taking back…", async () => {
                    await send({ ...showroomContract, functionName: "cancel", args: [desk.id] });
                  })
                }
              >
                {pending === "Taking back…" ? "Taking back…" : "Take it back"}
              </button>
            ) : null}
            {error ? (
              <p data-testid={`error-${id}`} className="text-[11px]">
                {error}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}
