"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAddress, isAddress, type Address } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import { ShareBar } from "@/components/ShareBar";
import {
  bond,
  bondLabel,
  cardMessage,
  emptySocials,
  linkMessage,
  same,
  shortWallet,
  socialHref,
  socialKinds,
  socialLabel,
  socialText,
  type Bond,
  type MemberCard,
  type SocialKind,
  type Socials,
} from "@/lib/members";

export function MembersRoom() {
  const params = useParams<{ address?: string }>();
  const raw = typeof params.address === "string" ? params.address : "";
  const focus = isAddress(raw) ? getAddress(raw) : null;
  const badFocus = raw.length > 0 && !focus;
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [members, setMembers] = useState<MemberCard[]>([]);
  const [name, setName] = useState("");
  const [line, setLine] = useState("");
  const [socials, setSocials] = useState<Socials>(emptySocials());
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const filled = useRef("");

  useEffect(() => {
    let stop = false;
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    async function pull() {
      try {
        const response = await fetch(`${base}/api/members`);
        if (!response.ok) throw new Error("members");
        const body = (await response.json()) as { members?: MemberCard[] };
        if (!stop) setMembers(body.members ?? []);
      } catch {
        if (!stop) setError("The member book did not answer.");
      } finally {
        if (!stop) setReady(true);
      }
    }
    void pull();
    return () => {
      stop = true;
    };
  }, []);

  useEffect(() => {
    if (!address || !ready) return;
    const key = address.toLowerCase();
    if (filled.current === key) return;
    filled.current = key;
    const mine = members.find((card) => same(card.address, address));
    if (!mine) return;
    setName(mine.name);
    setLine(mine.line);
    setSocials(mine.socials);
  }, [address, members, ready]);

  useEffect(() => {
    if (!focus) return;
    document.getElementById(`member-${focus}`)?.scrollIntoView({ block: "center" });
  }, [focus, members]);

  const mine = address ? members.find((card) => same(card.address, address)) : undefined;
  const shown = members
    .filter((card) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return true;
      return card.name.toLowerCase().includes(needle) || card.address.toLowerCase().includes(needle);
    })
    .sort((left, right) => {
      if (focus && same(left.address, focus)) return -1;
      if (focus && same(right.address, focus)) return 1;
      return left.at < right.at ? 1 : -1;
    });

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!address) {
      setError("Connect a wallet first.");
      return;
    }
    setError(null);
    setPending("save");
    try {
      const at = Math.floor(Date.now() / 1000);
      const message = cardMessage({ address, name, line, socials, at });
      const signature = await signMessageAsync({ message });
      const member = await postMember("card", message, signature);
      setMembers((current) => upsert(current, member));
    } catch (err) {
      setError(err instanceof Error ? err.message : "The card did not save.");
    } finally {
      setPending(null);
    }
  }

  async function toggle(card: MemberCard, on: boolean) {
    if (!address) {
      setError("Connect a wallet first.");
      return;
    }
    setError(null);
    setPending(card.address);
    try {
      const at = Math.floor(Date.now() / 1000);
      const message = linkMessage({ address, other: card.address, on, at });
      const signature = await signMessageAsync({ message });
      const member = await postMember("link", message, signature);
      setMembers((current) => upsert(current, member));
    } catch (err) {
      setError(err instanceof Error ? err.message : "The link did not save.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div>
      <p className="label">The street</p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight sm:text-6xl">A card, not a share</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
        Put your name and the socials you want on a card. Link another member when you want them on yours. A link is a hello. It earns nothing, and it is not a share of anyone.
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">
        Your wallet signs the card. The signature proves the wallet. It does not move funds.{" "}
        <Link href="/guide" className="text-brass">
          Read the guide.
        </Link>
      </p>
      <ShareBar id="members" />

      <section className="panel mt-8 p-6 sm:p-8">
        <p className="label">{mine ? "Your card" : "Sign a card"}</p>
        <h2 className="mt-2 font-serif text-3xl">{address ? shortWallet(address) : "Connect a wallet"}</h2>
        <form className="mt-5 grid gap-3" onSubmit={(event) => void save(event)}>
          <label className="grid gap-1 text-sm text-ink/70">
            Name
            <input
              data-testid="member-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={24}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-ink"
              spellCheck={false}
              aria-label="Name on the card"
            />
          </label>
          <label className="grid gap-1 text-sm text-ink/70">
            Line
            <input
              data-testid="member-line"
              value={line}
              onChange={(event) => setLine(event.target.value)}
              maxLength={96}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-ink"
              aria-label="A line on the card"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {socialKinds.map((kind) => (
              <label key={kind} className="grid gap-1 text-sm text-ink/70">
                {socialLabel(kind)}
                <input
                  data-testid={`member-${kind}`}
                  value={socials[kind]}
                  onChange={(event) => setSocials((current) => ({ ...current, [kind]: event.target.value }))}
                  placeholder={socialHint(kind)}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-ink"
                  spellCheck={false}
                  autoCapitalize="none"
                  aria-label={socialLabel(kind)}
                />
              </label>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button className="btn-neon" type="submit" data-testid="save-member" disabled={pending === "save"}>
              {pending === "save" ? "Confirm in your wallet" : "Sign the card"}
            </button>
            <p className="text-sm text-ink/55">The card is public. Leave a social blank to keep it off.</p>
          </div>
        </form>
        {error ? (
          <p className="mt-4 text-brass" data-testid="member-error">
            {error}
          </p>
        ) : null}
      </section>

      <section className="mt-8" data-testid="members-board">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">Members</p>
            <h2 className="mt-2 font-serif text-3xl">{members.length === 1 ? "1 card" : `${members.length} cards`}</h2>
          </div>
          <input
            data-testid="member-filter"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name or wallet"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-ink sm:w-64"
            spellCheck={false}
            aria-label="Find a member"
          />
        </div>
        {badFocus ? <p className="mt-4 text-brass">That is not a wallet.</p> : null}
        {ready && shown.length === 0 ? (
          <p className="mt-6 text-ink/70">{members.length === 0 ? "The street is quiet. Sign a card and you are the first." : "No card matches."}</p>
        ) : null}
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((card) => {
            const kind = bond(address ?? null, card, members);
            const inbound = members.filter((item) => item.links.some((link) => same(link, card.address))).length;
            const verb = linkVerb(kind);
            return (
              <li key={card.address} id={`member-${card.address}`}>
                <article
                  data-testid={`member-card-${card.address}`}
                  className={focus && same(card.address, focus) ? "panel h-full border-brass p-5" : "panel h-full p-5"}
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-brass font-serif text-lg text-brass">
                      {mark(card.name)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-serif text-2xl leading-tight">
                        <Link href={`/members/${card.address}`} className="hover:text-brass">
                          {card.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-[11px] tracking-[0.08em] text-ink/45">{shortWallet(card.address)}</p>
                    </div>
                  </div>
                  {card.line ? <p className="mt-4 leading-relaxed text-ink/80">{card.line}</p> : null}
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {socialKinds.map((social) =>
                      card.socials[social] ? (
                        <li key={social}>
                          <a
                            href={socialHref(social, card.socials[social])}
                            target="_blank"
                            rel="noreferrer"
                            className="chip"
                          >
                            {socialLabel(social)} {socialText(social, card.socials[social])}
                          </a>
                        </li>
                      ) : null,
                    )}
                  </ul>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[11px] tracking-[0.12em] text-ink/45">
                      {bondLabel(kind)} · {inbound === 1 ? "1 link in" : `${inbound} links in`}
                    </p>
                    {verb ? (
                      <button
                        type="button"
                        className="btn-ghost"
                        data-testid={`link-member-${card.address}`}
                        disabled={pending === card.address}
                        onClick={() => void toggle(card, kind === "none" || kind === "in")}
                      >
                        {pending === card.address ? "Confirm in your wallet" : verb}
                      </button>
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function socialHint(kind: SocialKind): string {
  switch (kind) {
    case "x":
      return "handle";
    case "farcaster":
      return "name";
    case "telegram":
      return "handle";
    case "site":
      return "https://";
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

function linkVerb(kind: Bond): string | null {
  switch (kind) {
    case "you":
      return null;
    case "both":
    case "out":
      return "Unlink";
    case "in":
      return "Link back";
    case "none":
      return "Link";
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

function mark(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0] ?? "").join("").toUpperCase();
}

function upsert(current: MemberCard[], member: MemberCard): MemberCard[] {
  const rest = current.filter((card) => !same(card.address, member.address));
  return [member, ...rest];
}

async function postMember(kind: "card" | "link", message: string, signature: string): Promise<MemberCard> {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const response = await fetch(`${base}/api/members`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind, message, signature }),
  });
  const body = (await response.json()) as { member?: MemberCard; error?: string };
  if (!response.ok || !body.member) throw new Error(body.error || "The card did not save.");
  return body.member;
}
