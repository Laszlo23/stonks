"use client";

import { useAccount } from "wagmi";
import { DeskCard } from "@/components/DeskCard";
import { StreetEye } from "@/components/StreetEye";
import { Vault } from "@/components/Vault";
import { night } from "@/lib/art";
import { chapters, floorLead, steps } from "@/lib/stories";
import { isMine, useFloor } from "@/lib/useFloor";

export default function FloorPage() {
  const { address } = useAccount();
  const { desks, ready, error, seated: live } = useFloor();
  const mine = desks.filter((desk) => isMine(desk, address));
  const room = desks.filter((desk) => desk.status === "onShift" && !isMine(desk, address));

  return (
    <div>
      <section className="panel overflow-hidden">
        <div className="relative">
          <img src={night("forest.webp")} alt="" className="h-72 w-full object-cover object-[center_20%] sm:h-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-[#050505]/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="label">Night Ledger · Robinhood Chain</p>
            <h1 className="mt-2 font-serif text-5xl tracking-tight sm:text-6xl">Desks that earn</h1>
          </div>
        </div>
        <p className="max-w-3xl p-6 text-lg leading-relaxed text-ink/85 sm:p-8">{floorLead}</p>
      </section>
      <div className="mt-6 grid items-start gap-4 lg:grid-cols-2">
        <Vault />
        <StreetEye />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {chapters.map((chapter) => (
          <figure key={chapter.key} className="panel overflow-hidden">
            <img src={chapter.src} alt="" className="h-44 w-full object-cover" />
            <figcaption className="p-5">
              <p className="label">{chapter.kicker}</p>
              <h2 className="mt-2 font-serif text-2xl tracking-tight">{chapter.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{chapter.body}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <section className="mt-14">
        <p className="label">The night</p>
        <h2 className="mt-2 font-serif text-4xl tracking-tight">How a desk earns</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="panel p-5">
              <p className="font-serif text-3xl text-brass">{step.n}</p>
              <h3 className="mt-2 font-serif text-xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
      {!live ? <p className="mt-10">The floor has no contracts yet.</p> : null}
      {error ? <p className="mt-10">The floor is not answering.</p> : null}
      {live && ready && !address ? <p className="mt-10 text-lg">Connect a wallet to see your desks.</p> : null}
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
