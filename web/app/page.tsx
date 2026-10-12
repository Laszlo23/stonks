"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { DeskCard } from "@/components/DeskCard";
import { StreetEye } from "@/components/StreetEye";
import { Vault } from "@/components/Vault";
import { ShareBar } from "@/components/ShareBar";
import { Wire } from "@/components/Wire";
import { night } from "@/lib/art";
import { games, type GameKey } from "@/lib/games";
import { floorLead } from "@/lib/stories";
import { isMine, useFloor } from "@/lib/useFloor";

export default function FloorPage() {
  const { address } = useAccount();
  const { desks, ready, error, seated: live } = useFloor();
  const mine = desks.filter((desk) => isMine(desk, address));
  const room = desks.filter((desk) => desk.status === "onShift" && !isMine(desk, address));

  return (
    <div>
      <section className="panel night-hero sitting overflow-hidden">
        <div className="night-frame">
          <img
            src={night("forest.webp")}
            alt=""
            width={1280}
            height={720}
            fetchPriority="high"
            decoding="async"
            className="night-still night-drift h-48 w-full object-cover object-[center_20%] sm:h-64"
          />
          <video
            className="night-intro"
            autoPlay
            muted
            loop
            playsInline
            poster={night("forest.webp")}
            aria-label="The pixel, the tape, the desk"
          >
            <source src={night("intro.mp4")} type="video/mp4" />
          </video>
        </div>
        <div className="px-6 pt-10 pb-6 sm:px-8 sm:pt-12 sm:pb-8">
          <p className="label">Hood Street</p>
          <h1 className="title-line mt-2 font-serif text-5xl tracking-tight sm:text-6xl">The pixel, the tape, the desk</h1>
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
          <p className="label">Names · Robinhood Chain</p>
          <h2 className="mt-2 font-serif text-3xl">A name on the street</h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            alice.street.hood points at a wallet. The cover is 0.001 ETH. Holding the name earns nothing. If street.hood is not renewed, the name stops resolving.
          </p>
        </div>
        <Link href="/names" className="btn-neon">
          Open Names
        </Link>
      </section>
      <section className="panel mt-6 flex flex-wrap items-end justify-between gap-5 p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="label">Stock · Robinhood Chain</p>
          <h2 className="mt-2 font-serif text-3xl">A price, not a share</h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            A Stock Token is a debt security from Robinhood Assets in Jersey. It tracks a price. It does not make the holder a shareholder. There is no buy button here. The swap stays on the dex.
          </p>
        </div>
        <Link href="/stock" className="btn-ghost">
          Open Stock
        </Link>
      </section>
      <section className="panel mt-6 flex flex-wrap items-end justify-between gap-5 p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="label">04 · Keys · Practice table</p>
          <h2 className="mt-2 font-serif text-3xl">A pass to a desk</h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            Ten practice USDG for the first pass, then five more for each one already out. A 2% cover waits for the desk. Holding the pass earns nothing. It is not a share of anyone.{" "}
            <a className="text-brass" href="https://basefriend.tech/">BaseFriend</a> is a different key, on Base.
          </p>
        </div>
        <Link href="/keys" className="btn-neon">
          Open Keys
        </Link>
      </section>
      <section className="panel mt-6 flex flex-wrap items-end justify-between gap-5 p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="label">Members</p>
          <h2 className="mt-2 font-serif text-3xl">A card, not a share</h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            Put a name and the socials you want on a card. Link another member when you want them on yours. A link is a hello. It earns nothing.
          </p>
        </div>
        <Link href="/members" className="btn-neon">
          Open Members
        </Link>
      </section>
      <section id="games" className="panel mt-6 p-6 sm:p-8">
        <p className="label">The games</p>
        <h2 className="mt-2 font-serif text-3xl">What you can play</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink/75">
          The same four sit together in the footer. The name is the game.
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {games.map((game) => (
            <li key={game.key}>
              <a href={game.href} className="game-tile flex h-full flex-col items-center gap-2 rounded-2xl border border-white/10 px-3 py-5 text-center">
                <GameMark name={game.key} />
                <span className="text-sm text-brass">{game.label}</span>
                <span className="text-xs leading-relaxed text-ink/65">{game.line}</span>
              </a>
            </li>
          ))}
        </ul>
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

function gameMark(name: GameKey): string {
  switch (name) {
    case "gm":
      return '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.5 1.5M16.4 16.4l1.5 1.5M17.9 6.1l-1.5 1.5M7.6 16.4l-1.5 1.5"/>';
    case "mine":
      return '<path d="M4 16.5 14 6.5l3.5 3.5-10 10z"/><path d="M13 7.5 16.5 4 20 7.5 16.5 11"/>';
    case "hood":
      return '<path d="M5 11.5 12 5l7 6.5V19H5z"/><path d="M10 19v-4h4v4"/>';
    case "casino":
      return '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.4"/><path d="M12 4.5v2.4M12 17.1v2.4M4.5 12h2.4M17.1 12h2.4"/>';
    default: {
      const exhaustive: never = name;
      return exhaustive;
    }
  }
}

function GameMark({ name }: { name: GameKey }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6 text-brass"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: gameMark(name) }}
    />
  );
}
