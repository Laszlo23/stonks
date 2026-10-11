"use client";

import Link from "next/link";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { night, tierArt } from "@/lib/art";
import { addresses, showroomContract } from "@/lib/contracts";
import { deskNumber, formatAmount } from "@/lib/format";
import { showroomTale } from "@/lib/stories";
import { tierLabel, tierNote, type Tier } from "@/lib/types";
import { held, tillOf, useFloor } from "@/lib/useFloor";
import { useMoves } from "@/lib/useMoves";

export default function ShowroomPage() {
  const { address } = useAccount();
  const { desks, ready } = useFloor();
  const listings = desks.filter((desk) => desk.status === "listed" && desk.seller !== zeroAddress);

  return (
    <div>
      <section className="panel relative mb-8 overflow-hidden">
        <img src={night("street.webp")} alt="" className="h-56 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="label">The showroom</p>
          <h1 className="mt-2 font-serif text-5xl tracking-tight">Desks for sale</h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed">{showroomTale}</p>
        </div>
      </section>
      {!ready ? <p className="mt-10">Looking across the room.</p> : null}
      {ready && listings.length === 0 ? <p className="mt-10">Nothing is for sale.</p> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((desk) => (
          <Listing key={desk.id.toString()} deskId={desk.id.toString()} price={desk.price} seller={desk.seller} buyer={address} tier={desk.tier} till={tillOf(desk)} usdg={held(desk).usdg} stonk={held(desk).stonk} />
        ))}
      </div>
    </div>
  );
}

function Listing({
  deskId,
  price,
  seller,
  buyer,
  tier,
  till,
  usdg,
  stonk,
}: {
  deskId: string;
  price: bigint;
  seller: `0x${string}`;
  buyer?: `0x${string}`;
  tier: Tier;
  till: bigint;
  usdg: bigint;
  stonk: bigint;
}) {
  const mine = buyer && seller.toLowerCase() === buyer.toLowerCase();
  const { pending, error, move, send, approve } = useMoves();
  const id = BigInt(deskId);

  return (
    <article data-testid={`listing-${deskId}`} className="panel overflow-hidden">
      <div className="relative">
        <img src={tierArt(tier)} alt="" className="h-48 w-full object-cover" />
        <p className="chip absolute right-3 top-3">{tierLabel(tier)}</p>
      </div>
      <div className="p-5">
      <Link href={`/desk?id=${deskId}`} className="font-serif text-2xl">
        Desk {deskNumber(id)}
      </Link>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{tierNote(tier)}</p>
      <p className="mt-4 font-serif text-4xl tabular">{formatAmount(price)}</p>
      <p className="text-[11px] tracking-[0.14em] text-ink/50">USDG ASKED</p>
      <p className="mt-4 text-sm tabular">Till {formatAmount(till)}</p>
      <p className="mt-1 text-[11px] tabular text-ink/60">
        {formatAmount(usdg)} USDG · {formatAmount(stonk)} STONK
      </p>
      {mine ? (
        <button
          type="button"
          data-testid={`cancel-${deskId}`}
          disabled={pending !== null}
          className="btn-ghost mt-5 w-full"
          onClick={() =>
            move("Taking back…", async () => {
              await send({ ...showroomContract, functionName: "cancel", args: [id] });
            })
          }
        >
          {pending ? "Taking back…" : "Take it back"}
        </button>
      ) : (
        <button
          type="button"
          data-testid={`buy-${deskId}`}
          disabled={pending !== null}
          className="btn-neon mt-5 w-full"
          onClick={() =>
            move("Buying…", async () => {
              await approve(addresses.usdg, addresses.showroom, price);
              await send({ ...showroomContract, functionName: "buy", args: [id] });
            })
          }
        >
          {pending ? "Buying…" : "Buy the desk"}
        </button>
      )}
      {error ? <p className="mt-3 text-[11px]">{error}</p> : null}
      </div>
    </article>
  );
}
