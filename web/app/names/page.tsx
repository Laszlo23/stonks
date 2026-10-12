"use client";

import { useState } from "react";
import Link from "next/link";
import { formatEther, isAddress, zeroAddress, type Address } from "viem";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { ShareBar } from "@/components/ShareBar";
import { robinhood } from "@/lib/chain";
import { explain } from "@/lib/explain";
import {
  controllerAbi,
  hoodController,
  hoodLabel,
  hoodRegistry,
  hoodResolver,
  nameCover,
  nameYear,
  registryAbi,
  resolverAbi,
  streetNames,
  streetNamesAbi,
  streetNode,
} from "@/lib/hood";
import { ensureChain } from "@/lib/wagmi";

function eth(wei: bigint): string {
  const [whole, frac = ""] = formatEther(wei).split(".");
  const cut = frac.slice(0, 5).replace(/0+$/, "");
  return cut.length > 0 ? `${whole}.${cut}` : whole;
}

export default function NamesPage() {
  const { address, connector } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient({ chainId: robinhood.id });
  const available = useReadContract({
    chainId: robinhood.id,
    address: hoodController,
    abi: controllerAbi,
    functionName: "available",
    args: ["street"],
  });
  const price = useReadContract({
    chainId: robinhood.id,
    address: hoodController,
    abi: controllerAbi,
    functionName: "price",
    args: ["street", nameYear],
  });
  const parent = useReadContract({
    chainId: robinhood.id,
    address: hoodRegistry,
    abi: registryAbi,
    functionName: "owner",
    args: [streetNode],
  });

  const [query, setQuery] = useState("robin.hood");
  const [found, setFound] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parentLine = parentLineFor(parent.data, available.data, price.data);

  async function lookup() {
    const name = query.trim().toLowerCase();
    if (!name.endsWith(".hood")) {
      setFound(null);
      setError("Ask for a name that ends in .hood.");
      return;
    }
    if (!client) {
      setError("Robinhood Chain is not connected.");
      return;
    }
    setError(null);
    setPending("lookup");
    try {
      const who = await client.readContract({
        address: hoodResolver,
        abi: resolverAbi,
        functionName: "resolve",
        args: [name],
      });
      setFound(who === zeroAddress ? `${name} has no address.` : `${name} points at ${who}`);
    } catch (err) {
      setFound(null);
      setError(explain(err));
    } finally {
      setPending(null);
    }
  }

  async function buy() {
    const next = label.trim().toLowerCase();
    if (!address) {
      setError("Connect a wallet first.");
      return;
    }
    if (!hoodLabel(next)) {
      setError("Use 3 to 32 letters, numbers, or a hyphen.");
      return;
    }
    if (streetNames === zeroAddress || parent.data?.toLowerCase() !== streetNames.toLowerCase()) {
      setError(
        parent.data && parent.data !== zeroAddress
          ? "street.hood is registered to another wallet. Subnames are not for sale from this room."
          : "street.hood is not seated yet. Buying a subname waits until the parent can be paid for.",
      );
      return;
    }
    if (!client) {
      setError("Robinhood Chain is not connected.");
      return;
    }
    setError(null);
    setPending("buy");
    try {
      const ethereum = (window as Window & { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
      if (connector?.id === "injected" && ethereum) {
        await ensureChain(ethereum as never, robinhood.id);
      }
      const hash = await writeContractAsync({
        chainId: robinhood.id,
        address: streetNames,
        abi: streetNamesAbi,
        functionName: "buy",
        args: [next],
        value: nameCover,
      });
      await client.waitForTransactionReceipt({ hash });
      setFound(`${next}.street.hood points at ${address}`);
    } catch (err) {
      setError(explain(err));
    } finally {
      setPending(null);
    }
  }

  return (
    <div>
      <p className="label">Robinhood Chain</p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight sm:text-6xl">A name on the street</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
        A subname such as alice.street.hood points at a wallet. The cover is 0.001 ETH and it sits in a till. Holding the name earns nothing. If street.hood is not renewed, the subnames stop resolving.
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">
        Names use the hood.ag registry on Robinhood Chain.{" "}
        <Link href="/guide" className="text-brass">
          Read the guide.
        </Link>
      </p>
      <ShareBar id="names" />

      <section className="panel mt-8 p-6 sm:p-8">
        <p className="label">Look up</p>
        <h2 className="mt-2 font-serif text-3xl">Where a .hood name points</h2>
        <form
          className="mt-5 flex flex-wrap gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void lookup();
          }}
        >
          <input
            data-testid="name-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-ink"
            spellCheck={false}
            autoCapitalize="none"
            aria-label="A .hood name"
          />
          <button className="btn-neon" type="submit" data-testid="resolve-name" disabled={pending === "lookup"}>
            {pending === "lookup" ? "Looking" : "Look up"}
          </button>
        </form>
        {found ? <p className="mt-4 break-all text-ink/80">{found}</p> : null}
      </section>

      <section className="panel mt-6 p-6 sm:p-8">
        <p className="label">street.hood</p>
        <h2 className="mt-2 font-serif text-3xl">Buy a subname</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink/75">{parentLine}</p>
        <form
          className="mt-5 flex flex-wrap gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void buy();
          }}
        >
          <input
            data-testid="name-label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="alice"
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-ink"
            spellCheck={false}
            autoCapitalize="none"
            aria-label="Subname"
          />
          <button className="btn-neon" type="submit" data-testid="buy-name" disabled={pending === "buy"}>
            {pending === "buy" ? "Confirm in your wallet" : "Buy · 0.001 ETH"}
          </button>
        </form>
        <p className="mt-3 text-sm text-ink/55">Your wallet confirms this on Robinhood Chain. The name is not a share.</p>
        {error ? (
          <p className="mt-4 text-brass" data-testid="name-error">
            {error}
          </p>
        ) : null}
      </section>
    </div>
  );
}

function parentLineFor(owner: Address | undefined, open: boolean | undefined, cost: bigint | undefined): string {
  if (owner && owner !== zeroAddress && isAddress(owner)) {
    return streetNames !== zeroAddress && owner.toLowerCase() === streetNames.toLowerCase()
      ? "street.hood is seated. A subname costs a flat 0.001 ETH cover."
      : `street.hood is registered to ${owner}. Subnames are not for sale from this room.`;
  }
  if (open === false) return "street.hood is not free. Subnames are not for sale from this room.";
  if (cost !== undefined) {
    return `street.hood is free. One year is ${eth(cost)} ETH. The parent is not seated yet, because that price is still unpaid. A subname waits until then.`;
  }
  return "Reading street.hood from Robinhood Chain.";
}
