"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { night } from "@/lib/art";
import { robinhood } from "@/lib/chain";

export function RobinhoodSeat() {
  const [block, setBlock] = useState<bigint | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let stop = false;
    const client = createPublicClient({ chain: robinhood, transport: http() });

    async function pull() {
      try {
        const height = await client.getBlockNumber();
        if (stop) return;
        setBlock(height);
        setFailed(false);
      } catch {
        if (!stop) setFailed(true);
      }
    }

    void pull();
    const timer = setInterval(() => {
      void pull();
    }, 4000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, []);

  let blockLine = "Reading the chain…";
  if (failed) blockLine = "The chain did not answer.";
  else if (block !== null) blockLine = `Block ${block.toString()}`;

  return (
    <section className="panel relative overflow-hidden">
      <img src={night("forest.webp")} alt="" className="h-80 w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-8">
        <p className="label">Robinhood Chain · 4663</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight">Not seated yet</h1>
        <p data-testid="robinhood-block" className="mt-5 text-sm tabular">
          {blockLine}
        </p>
        <p className="mt-3 max-w-lg text-lg leading-relaxed">
          The Floor is not seated on this chain yet. The playable desks are on the local table.
        </p>
        <a
          className="chip mt-6"
          href="https://robinhoodchain.blockscout.com"
          target="_blank"
          rel="noreferrer"
        >
          Explorer
        </a>
      </div>
    </section>
  );
}
