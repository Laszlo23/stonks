"use client";

import { useEffect, useState } from "react";

type Eye = {
  pixel: { phase: string; minted: number; supply: number; seats: string };
  hood: { priceUsd: string | null; poolUsd: string | null; volume24hUsd: string | null };
  seats: { id: number; owner: string }[];
  fresh: { id: string; to: string; tx: string }[];
};

function money(value: string | null, digits = 2): string {
  if (!value) return "—";
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  if (number > 0 && number < 0.01) return `$${number.toFixed(6)}`;
  return `$${number.toLocaleString(undefined, { maximumFractionDigits: digits })}`;
}

export function StreetEye() {
  const [eye, setEye] = useState<Eye | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let stop = false;
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

    async function pull() {
      try {
        const response = await fetch(`${base}/eye`, { cache: "no-store" });
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

  const hoodQuiet = eye ? Number(eye.hood.volume24hUsd ?? "0") === 0 : false;

  return (
    <section className="panel p-6">
      <p className="label">The eye</p>
      <h2 className="mt-2 font-serif text-4xl tracking-tight">Hood Street</h2>
      {failed && !eye ? <p className="mt-4">The street did not answer.</p> : null}
      {!eye && !failed ? <p className="mt-4">Reading the street…</p> : null}
      {eye ? (
        <div className="mt-4 space-y-5">
          <div>
            <p className="text-[11px] tracking-[0.16em] text-ink/50">$HOOD</p>
            <p className="mt-1 font-serif text-3xl tabular">{money(eye.hood.priceUsd, 6)}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink/75">
              Pool {money(eye.hood.poolUsd)}. Last day {money(eye.hood.volume24hUsd)}.
              {hoodQuiet ? " The pool is quiet. The price is a sliver." : ""}
            </p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.16em] text-ink/50">PIXEL</p>
            <p className="mt-1 font-serif text-3xl">
              {eye.pixel.phase} · {eye.pixel.minted} / {eye.pixel.supply}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink/75">
              {eye.pixel.phase === "Public"
                ? "The pixel is on. A seat is 0.0001 ETH. Five to a wallet."
                : "The pixel is not public yet."}
            </p>
            <a className="chip mt-3" href={eye.pixel.seats}>
              Take a seat
            </a>
          </div>
          <ul className="space-y-1 text-sm tabular text-ink/80">
            {(eye.fresh.length > 0
              ? eye.fresh.map((mint) => ({ id: mint.id, who: mint.to }))
              : eye.seats.map((seat) => ({ id: String(seat.id), who: seat.owner }))
            ).map((seat) => (
              <li key={seat.id}>
                Pixel {seat.id} · {seat.who}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
