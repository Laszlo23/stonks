"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { DeskCard } from "@/components/DeskCard";
import { StreetEye } from "@/components/StreetEye";
import { Vault } from "@/components/Vault";
import { ShareBar } from "@/components/ShareBar";
import { Wire } from "@/components/Wire";
import { night } from "@/lib/art";
import { floorLead } from "@/lib/stories";
import { isMine, useFloor } from "@/lib/useFloor";

export default function FloorPage() {
  const { address } = useAccount();
  const { desks, ready, error, seated: live } = useFloor();
  const mine = desks.filter((desk) => isMine(desk, address));
  const room = desks.filter((desk) => desk.status === "onShift" && !isMine(desk, address));

  return (
    <div>
      <section className="panel overflow-hidden">
        <img
          src={night("forest.webp")}
          alt=""
          width={800}
          height={450}
          fetchPriority="high"
          decoding="async"
          className="h-40 w-full object-cover object-[center_20%] sm:h-48"
        />
        <div className="p-6 sm:p-8">
          <p className="label">Hood Street</p>
          <h1 className="mt-2 font-serif text-5xl tracking-tight sm:text-6xl">The pixel, the tape, the desk</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink/85">{floorLead}</p>
          <div className="mt-5 flex flex-wrap gap-3">
          <a className="btn-neon" href="https://nft.aibusiness.fun/">
            Take a pixel seat
          </a>
          <a className="btn-ghost" href="#tape">
            Today&apos;s numbers
          </a>
          <Link href="/blog" className="btn-ghost">
            The blog
          </Link>
          <Link href="/guide" className="btn-ghost">
            How this works
          </Link>
          </div>
          <ShareBar id="floor" />
        </div>
      </section>
      <div className="mt-6">
        <StreetEye />
      </div>
      <div id="tape" className="mt-6 scroll-mt-6">
        <Wire kicker="02 · The tape" />
      </div>
      <div id="desk" className="mt-6 scroll-mt-6">
        <Vault />
      </div>
      <section className="panel mt-6 flex flex-wrap items-end justify-between gap-5 p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="label">04 · Keys · Base</p>
          <h2 className="mt-2 font-serif text-3xl">A pass into a room</h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            <a className="text-brass" href="https://basefriend.tech/">BaseFriend</a> sells a key to a Farcaster creator or a club.
            DEGEN pays. ETH is the gas. The key opens a chat. It is not a share of the person, and a listed name may not have joined.
            Prices can fall. Genesis claims are still locked.
          </p>
        </div>
        <a className="btn-neon" href="https://basefriend.tech/">
          Open Keys
        </a>
      </section>
      <p className="mt-6 text-sm text-ink/60">
        The steps, the words, and the room list are in the <Link href="/guide" className="text-brass">guide</Link>.
      </p>
      {!live ? <p className="mt-10">The floor has no contracts yet.</p> : null}
      {error ? <p className="mt-10">The floor is not answering.</p> : null}
      {live && ready && !address ? <p className="mt-10 text-lg">Connect a wallet to see your practice desks.</p> : null}
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
