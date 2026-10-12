"use client";

import { useAccount, useReadContract } from "wagmi";
import { addresses, keysContract, sameAddress } from "@/lib/contracts";
import { deskNumber, formatAmount } from "@/lib/format";
import { tierLabel, type DeskRow } from "@/lib/types";
import { useMoves } from "@/lib/useMoves";

const ONE = 1n;

export function PassCard({ desk }: { desk: DeskRow }) {
  const { address } = useAccount();
  const { pending, error, move, send, approve } = useMoves();
  const id = desk.id;
  const mine = sameAddress(desk.owner, address) && desk.status !== "listed";

  const supply = useReadContract({
    ...keysContract,
    functionName: "supplyOf",
    args: [id],
    query: { refetchInterval: 15_000, refetchIntervalInBackground: false },
  });
  const held = useReadContract({
    ...keysContract,
    functionName: "balanceOf",
    args: address ? [id, address] : undefined,
    query: { enabled: Boolean(address), refetchInterval: 15_000, refetchIntervalInBackground: false },
  });
  const till = useReadContract({
    ...keysContract,
    functionName: "tillOf",
    args: [id],
    query: { enabled: mine, refetchInterval: 15_000, refetchIntervalInBackground: false },
  });
  const buyQuote = useReadContract({
    ...keysContract,
    functionName: "quoteBuy",
    args: [id, ONE],
    query: { refetchInterval: 15_000, refetchIntervalInBackground: false },
  });
  const sellQuote = useReadContract({
    ...keysContract,
    functionName: "quoteSell",
    args: [id, ONE],
    query: { enabled: (supply.data ?? 0n) > 0n, refetchInterval: 15_000, refetchIntervalInBackground: false },
  });

  const out = supply.data ?? 0n;
  const mineCount = held.data ?? 0n;
  const pay = buyQuote.data?.[0];
  const back = sellQuote.data?.[0];
  const cover = till.data ?? 0n;

  return (
    <article className="panel p-5">
      <p className="label">Desk {deskNumber(id)}</p>
      <h2 className="mt-2 font-serif text-3xl">{tierLabel(desk.tier)}</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink/70">
        {out.toString()} out. You hold {mineCount.toString()}.
        {desk.status === "listed" ? " This desk is listed. The cover waits." : ""}
        {mineCount > 0n ? " The back room is open. The pass does not pay you." : ""}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-neon"
          data-testid={`buy-pass-${id.toString()}`}
          disabled={Boolean(pending) || pay === undefined}
          onClick={() => {
            if (pay === undefined) return;
            void move("buy", async () => {
              await approve(addresses.usdg, addresses.keys, pay);
              await send({ ...keysContract, functionName: "buy", args: [id, ONE] });
            });
          }}
        >
          {pay === undefined ? "Buy a pass" : `Buy · ${formatAmount(pay)} USDG`}
        </button>
        <button
          type="button"
          className="btn-ghost"
          data-testid={`sell-pass-${id.toString()}`}
          disabled={Boolean(pending) || mineCount === 0n || back === undefined}
          onClick={() => {
            void move("sell", async () => {
              await send({ ...keysContract, functionName: "sell", args: [id, ONE] });
            });
          }}
        >
          {back === undefined ? "Sell a pass" : `Sell · ${formatAmount(back)} USDG`}
        </button>
        {mine && cover > 0n ? (
          <button
            type="button"
            className="btn-ghost"
            data-testid={`draw-cover-${id.toString()}`}
            disabled={Boolean(pending)}
            onClick={() => {
              void move("draw", async () => {
                await send({ ...keysContract, functionName: "draw", args: [id] });
              });
            }}
          >
            Take the cover · {formatAmount(cover)} USDG
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-3 text-[11px]">{error}</p> : null}
      {pending ? <p className="mt-3 text-[11px] text-ink/50">Waiting for the wallet.</p> : null}
    </article>
  );
}
