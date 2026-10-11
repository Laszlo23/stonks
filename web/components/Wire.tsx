"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShareBar } from "@/components/ShareBar";
import { wireTitle, type WireItem, type WireKind } from "@/lib/wire";

type Tape = {
  readAt: string;
  chain: { block: number | null; gasGwei: number | null; usdg: number | null };
  hood: { priceUsd: string | null; volume24hUsd: string | null; poolUsd: string | null };
  spy: { priceUsd: string | null; volume24hUsd: string | null; poolUsd: string | null };
  nvda: { priceUsd: string | null; volume24hUsd: string | null };
  dollar: { priceUsd: string | null; volume24hUsd: string | null; poolUsd: string | null };
  items: WireItem[];
};

function money(value: number | string | null, digits = 0): string {
  if (value === null || value === undefined) return "—";
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return "—";
  if (number > 0 && number < 0.01) return `$${number.toFixed(6)}`;
  if (number >= 1_000_000_000) return `$${(number / 1_000_000_000).toFixed(2)}B`;
  if (number >= 1_000_000) return `$${(number / 1_000_000).toFixed(1)}M`;
  if (number >= 1000) return `$${number.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `$${number.toLocaleString("en-US", { maximumFractionDigits: Math.max(digits, 2) })}`;
}

function plain(value: number | null): string {
  if (value === null) return "—";
  return value.toLocaleString("en-US");
}

export function Wire({ full = false, kicker = "The wire" }: { full?: boolean; kicker?: string }) {
  const [tape, setTape] = useState<Tape | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let stop = false;
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    async function pull() {
      try {
        const response = await fetch(`${base}/wire/feed`);
        if (!response.ok) throw new Error("wire");
        const body = (await response.json()) as Tape;
        if (!stop) {
          setTape(body);
          setFailed(false);
        }
      } catch {
        if (!stop) setFailed(true);
      }
    }
    void pull();
    const timer = window.setInterval(() => void pull(), 30000);
    return () => {
      stop = true;
      window.clearInterval(timer);
    };
  }, []);

  const items = tape?.items ?? [];
  const shown = full ? items : items.filter((item, index, all) => all.findIndex((other) => other.kind === item.kind) === index);
  const kinds: WireKind[] = ["alpha", "street", "shift"];

  return (
    <section className="panel p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">{kicker}</p>
          <h2 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">What the chain is doing</h2>
        </div>
        {full ? null : (
          <Link href="/wire" className="chip">
            The whole wire
          </Link>
        )}
      </div>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-ink/80">
        Stocks are moving as tokens. The dollar pool is the busy room. A Stock Token tracks a price. It does not make you a shareholder.
      </p>
      {full ? <ShareBar id="wire" /> : null}
      {failed && !tape ? <p className="mt-4">The wire did not answer.</p> : null}
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat k="USDG out" v={money(tape?.chain.usdg ?? null, 0)} />
        <Stat k="Dollar pool, day" v={money(tape?.dollar.volume24hUsd ?? null)} />
        <Stat k="NVDA token" v={money(tape?.nvda.priceUsd ?? null, 2)} />
        <Stat k="SPY token" v={money(tape?.spy.priceUsd ?? null, 2)} />
        <Stat k="$HOOD" v={money(tape?.hood.priceUsd ?? null, 6)} />
        <Stat k="Block" v={plain(tape?.chain.block ?? null)} />
      </dl>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink/60">
        USDG out is the real dollar token on Robinhood Chain. Dollar pool, day is how much of it traded. NVDA and SPY follow a stock price. They are not shares of the company. $HOOD is the small pool.
      </p>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {kinds.map((kind) => (
          <div key={kind}>
            <p className="label">{wireTitle(kind)}</p>
            <ul className="mt-3 space-y-4">
              {shown
                .filter((item) => item.kind === kind)
                .map((item) => (
                  <li key={item.href}>
                    <a href={item.href} target="_blank" rel="noreferrer" className="group block">
                      <p className="text-[11px] tracking-[0.14em] text-ink/45">
                        {item.date} · {item.source}
                      </p>
                      <h3 className="mt-1 font-serif text-2xl leading-tight tracking-tight group-hover:text-brass">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink/75">{item.body}</p>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      {tape ? (
        <p className="mt-6 text-[11px] tracking-[0.08em] text-ink/40">
          Read {clock(tape.readAt)}. This page keeps asking. Numbers come from Robinhood Chain and the pools. Gas{" "}
          {tape.chain.gasGwei === null ? "—" : `${tape.chain.gasGwei.toFixed(3)} gwei`}. $HOOD pool {money(tape.hood.poolUsd)}. Day volume{" "}
          {money(tape.hood.volume24hUsd)}. A stock token tracks a price. Holding one does not make you a shareholder.
        </p>
      ) : null}
    </section>
  );
}

function clock(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "just now";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-line px-3 py-3">
      <dt className="text-[11px] tracking-[0.14em] text-ink/45">{k}</dt>
      <dd className="mt-1 font-serif text-2xl tabular tracking-tight">{v}</dd>
    </div>
  );
}
