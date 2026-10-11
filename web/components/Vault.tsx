"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { addresses, deskContract, pitContract } from "@/lib/contracts";
import { tokenAbi } from "@/lib/abi";
import { formatAmount } from "@/lib/format";
import { held, isMine, tillOf, useFloor } from "@/lib/useFloor";
import { useMoves } from "@/lib/useMoves";

export function Vault() {
  const { address } = useAccount();
  const { desks } = useFloor();
  const { pending, error, move, send } = useMoves();
  const mine = desks.filter((desk) => isMine(desk, address));
  const open = mine.find((desk) => desk.status === "onShift");
  const idle = mine.find((desk) => desk.status === "idle");
  const bag = idle ? held(idle) : null;
  const stocked = Boolean(bag && bag.usdg > 0n && bag.stonk > 0n);
  const busy = pending !== null;

  let line = "One bag. Open it and swap fees stay in the till. Idle earns nothing.";
  if (open) line = `The vault is open. The till is ${formatAmount(tillOf(open))}. Claim or close it on the desk.`;
  else if (idle && stocked) line = "The bag is full. Open the vault and the seed starts.";
  else if (idle) line = "The seat is empty. Draw both coins, then put them in the bag.";
  else if (address) line = "You have no vault yet. One mint opens a seat. The chain rolls paper, brass, or ink.";

  return (
    <section className="panel p-6">
      <p className="label">03 · Practice table</p>
      <h2 className="mt-2 font-serif text-4xl tracking-tight">Open a desk</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
        Practice coins. They are not the Global Dollar on Robinhood Chain. Your wallet confirms the move. An idle desk earns nothing. Fees and new STONK are the yield, and neither is a promise.
      </p>
      <p className="mt-3 max-w-xl text-lg leading-relaxed text-ink/80">{line}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {!address ? <p className="text-sm text-ink/70">Connect a wallet. It confirms the open.</p> : null}
        {address && !open && !idle ? (
          <button
            type="button"
            data-testid="mint-desk"
            disabled={busy}
            className="btn-neon"
            onClick={() =>
              move("Minting…", async () => {
                await send({ ...deskContract, functionName: "mint" });
              })
            }
          >
            {pending === "Minting…" ? "Minting…" : "Open a vault"}
          </button>
        ) : null}
        {address && idle && !stocked ? (
          <>
            <button
              type="button"
              data-testid="draw-tokens"
              disabled={busy}
              className="btn-ghost"
              onClick={() =>
                move("Drawing…", async () => {
                  await send({ address: addresses.usdg, abi: tokenAbi, functionName: "faucet" });
                  await send({ address: addresses.stonk, abi: tokenAbi, functionName: "faucet" });
                })
              }
            >
              {pending === "Drawing…" ? "Drawing…" : "Draw both coins"}
            </button>
            <Link href={`/desk?id=${idle.id}`} className="btn-neon">
              Stock the bag
            </Link>
          </>
        ) : null}
        {address && idle && stocked ? (
          <button
            type="button"
            disabled={busy}
            className="btn-neon"
            onClick={() =>
              move("Opening…", async () => {
                await send({ ...pitContract, functionName: "openShift", args: [idle.id] });
              })
            }
          >
            {pending === "Opening…" ? "Opening…" : "Open the vault"}
          </button>
        ) : null}
        {open ? (
          <Link href={`/desk?id=${open.id}`} className="btn-neon">
            See the till
          </Link>
        ) : null}
      </div>
      {error ? <p className="mt-3 text-[11px]">{error}</p> : null}
    </section>
  );
}
