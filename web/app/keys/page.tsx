"use client";

import Link from "next/link";
import { ShareBar } from "@/components/ShareBar";
import { PassCard } from "@/components/PassCard";
import { useFloor } from "@/lib/useFloor";

export default function KeysPage() {
  const { desks, ready, error, seated } = useFloor();

  return (
    <div>
      <p className="label">Practice table</p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight sm:text-6xl">A pass to a desk</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
        Practice coins. They are not the Global Dollar. Draw them on the floor first. The first pass is 10 USDG. Each one already out adds 5. A 2% cover waits for the desk owner. Holding a pass earns nothing, and the pass cannot be sent to someone else.
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">
        <a className="text-brass" href="https://basefriend.tech/">
          BaseFriend
        </a>{" "}
        sells a different key, on Base, paid in DEGEN.{" "}
        <Link href="/guide" className="text-brass">
          Read the guide.
        </Link>
      </p>
      <ShareBar id="keys" />
      {!seated ? <p className="mt-10">The pass is not on this table yet.</p> : null}
      {error ? <p className="mt-10">The floor is not answering.</p> : null}
      {seated && ready && desks.length === 0 ? <p className="mt-10">No desk is open for a pass.</p> : null}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {desks.map((desk) => (
          <PassCard key={desk.id.toString()} desk={desk} />
        ))}
      </div>
    </div>
  );
}
