"use client";

import { useAccount } from "wagmi";
import { DeskCard } from "@/components/DeskCard";
import { night } from "@/lib/art";
import { addresses, deskContract } from "@/lib/contracts";
import { tokenAbi } from "@/lib/abi";
import { isMine, useFloor } from "@/lib/useFloor";
import { useMoves } from "@/lib/useMoves";

const tiles = [
  { src: night("coin.webp"), title: "Coin" },
  { src: night("bow.webp"), title: "Bow" },
  { src: night("seed.webp"), title: "Seed" },
  { src: night("street.webp"), title: "Hood Street" },
];

export default function FloorPage() {
  const { address } = useAccount();
  const { desks, ready, error, seated: live } = useFloor();
  const { pending, error: moveError, move, send } = useMoves();
  const mine = desks.filter((desk) => isMine(desk, address));
  const room = desks.filter((desk) => desk.status === "onShift" && !isMine(desk, address));

  return (
    <div>
      <section className="panel relative overflow-hidden">
        <img src={night("forest.webp")} alt="" className="h-80 w-full object-cover object-[center_20%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-[#050505]/10" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="label">Night Ledger · Robinhood Chain</p>
          <h1 className="mt-2 font-serif text-5xl tracking-tight sm:text-6xl">Desks that earn</h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-ink/85">
            Seat a desk and its bag works the pit. Swap fees stay in the bag. A little new STONK is paid on top. Neither is a promise of profit.
          </p>
        </div>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          data-testid="mint-desk"
          disabled={pending !== null || !live}
          className="btn-neon"
          onClick={() =>
            move("Minting…", async () => {
              await send({ ...deskContract, functionName: "mint" });
            })
          }
        >
          {pending === "Minting…" ? "Minting…" : "Mint a desk"}
        </button>
        <button
          type="button"
          data-testid="draw-tokens"
          disabled={pending !== null || !live}
          className="btn-ghost"
          onClick={() =>
            move("Drawing…", async () => {
              await send({ address: addresses.usdg, abi: tokenAbi, functionName: "faucet" });
              await send({ address: addresses.stonk, abi: tokenAbi, functionName: "faucet" });
            })
          }
        >
          {pending === "Drawing…" ? "Drawing…" : "Draw 10,000"}
        </button>
        <a href="https://doghood.aibusiness.fun/" className="chip" target="_blank" rel="noreferrer">
          Open the book
        </a>
      </div>
      {moveError ? <p className="mt-3 text-[11px]">{moveError}</p> : null}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => (
          <figure key={tile.title} className="panel overflow-hidden">
            <img src={tile.src} alt="" className="h-28 w-full object-cover" />
            <figcaption className="label px-3 py-2">{tile.title}</figcaption>
          </figure>
        ))}
      </div>
      {!live ? <p className="mt-10">The local table has no contracts yet.</p> : null}
      {error ? <p className="mt-10">The local table is not answering.</p> : null}
      {live && ready && !address ? <p className="mt-10 text-lg">Sit down to see your desks.</p> : null}
      {address ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl">
            Yours{" "}
            <span data-testid="your-desks" className="text-sm text-ink/50">
              {mine.length}
            </span>
          </h2>
          {mine.length === 0 ? <p className="mt-4">You have no desk yet.</p> : null}
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((desk) => (
              <DeskCard key={desk.id.toString()} desk={desk} />
            ))}
          </div>
        </section>
      ) : null}
      {room.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-serif text-2xl">Also on shift</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {room.map((desk) => (
              <DeskCard key={desk.id.toString()} desk={desk} quiet />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
