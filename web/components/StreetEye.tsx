"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";

type Eye = {
  pixel: { phase: string; minted: number; supply: number; publicWei?: string; seats: string };
  seats: { id: number; owner: string }[];
  fresh: { id: string; to: string; tx: string }[];
};

function priceLabel(wei: string | undefined): string {
  if (!wei) return "—";
  try {
    const eth = formatEther(BigInt(wei)).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
    return `${eth} ETH`;
  } catch {
    return "—";
  }
}

export function StreetEye() {
  const [eye, setEye] = useState<Eye | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let stop = false;
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

    async function pull() {
      try {
        const response = await fetch(`${base}/eye`);
        if (!response.ok) throw new Error("eye");
        const body = (await response.json()) as Eye;
        if (!stop) {
          setEye(body);
          setFailed(false);
        }
      } catch {
        if (!stop) setFailed(true);
      }
    }

    void pull();
    const timer = setInterval(() => {
      void pull();
    }, 20000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, []);

  const pixel = eye?.pixel;
  const open = pixel?.phase === "Public";
  const left = pixel ? Math.max(pixel.supply - pixel.minted, 0) : null;
  const taken = eye
    ? eye.fresh.length > 0
      ? eye.fresh.map((mint) => ({ id: mint.id, who: mint.to, tx: mint.tx }))
      : eye.seats.map((seat) => ({ id: String(seat.id), who: seat.owner, tx: "" }))
    : [];

  return (
    <section id="pixel" className="panel scroll-mt-6 p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">01 · The pixel · chain 4663</p>
          <h2 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">
            {open ? "The pixel is on" : pixel ? pixel.phase : "The pixel"}
          </h2>
        </div>
        {pixel ? (
          <a className="btn-neon" href={pixel.seats}>
            Take a seat
          </a>
        ) : null}
      </div>
      {failed && !eye ? <p className="mt-4">The mint did not answer.</p> : null}
      {!eye && !failed ? <p className="mt-4">Reading the mint…</p> : null}
      {pixel && left !== null ? (
        <>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink/80">
            {open
              ? "A seat is a pixel. It does not earn, and it is not a share. The price and the count are the contract."
              : "The public mint is not open. This page will say when it is."}
          </p>
          <dl className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-line px-3 py-3">
              <dt className="text-[11px] tracking-[0.14em] text-ink/45">Seats left</dt>
              <dd className="mt-1 font-serif text-3xl tabular tracking-tight text-brass sm:text-4xl">{left.toLocaleString("en-US")}</dd>
            </div>
            <div className="rounded-2xl border border-line px-3 py-3">
              <dt className="text-[11px] tracking-[0.14em] text-ink/45">Taken</dt>
              <dd className="mt-1 font-serif text-3xl tabular tracking-tight sm:text-4xl">
                {pixel.minted}
                <span className="text-lg text-ink/40"> / {pixel.supply}</span>
              </dd>
            </div>
            <div className="rounded-2xl border border-line px-3 py-3">
              <dt className="text-[11px] tracking-[0.14em] text-ink/45">Price</dt>
              <dd className="mt-1 font-serif text-2xl tabular tracking-tight sm:text-3xl">{open ? priceLabel(pixel.publicWei) : "—"}</dd>
            </div>
          </dl>
          {open ? <p className="mt-3 text-sm text-ink/70">Five seats to a wallet. Gas is ETH on Robinhood Chain.</p> : null}
          {taken.length > 0 ? (
            <ul className="mt-5 space-y-1 text-sm tabular text-ink/80">
              {taken.slice(0, 4).map((seat) => (
                <li key={seat.id}>
                  {seat.tx ? (
                    <a className="hover:text-brass" href={`https://robinhoodchain.blockscout.com/tx/${seat.tx}`} target="_blank" rel="noreferrer">
                      Pixel {seat.id} · {seat.who}
                    </a>
                  ) : (
                    <>
                      Pixel {seat.id} · {seat.who}
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-5 text-[11px] tracking-[0.08em] text-ink/40">
            Come back when the count moves. A new seat shows up here. The $HOOD pool is on the tape, under the numbers.
          </p>
        </>
      ) : null}
    </section>
  );
}
