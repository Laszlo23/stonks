"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReadContract, useAccount } from "wagmi";
import { tokenAbi } from "@/lib/abi";
import { addresses, seated } from "@/lib/contracts";
import { formatAmount } from "@/lib/format";
import { useTable } from "@/app/providers";
import { night } from "@/lib/art";
import { Connect } from "./Connect";
import { RobinhoodSeat } from "./RobinhoodSeat";
import { Street, appLinks } from "./Street";
import { Tape } from "./Tape";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { table, setTable } = useTable();
  const { address } = useAccount();
  const usdg = useReadContract({
    address: addresses.usdg,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: seated && table === "anvil" && Boolean(address), refetchInterval: 10_000, refetchIntervalInBackground: false },
  });
  const stonk = useReadContract({
    address: addresses.stonk,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: seated && table === "anvil" && Boolean(address), refetchInterval: 10_000, refetchIntervalInBackground: false },
  });

  const balances =
    address && table === "anvil" && seated
      ? `${formatAmount(usdg.data ?? 0n)} USDG · ${formatAmount(stonk.data ?? 0n)} STONK`
      : null;

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 py-5">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <img src={night("seal.webp")} alt="" width={44} height={44} decoding="async" className="seal h-11 w-11 rounded-2xl object-cover" />
            <span>
              <span className="block whitespace-nowrap font-serif text-xl leading-none sm:text-2xl">The Floor</span>
              <span className="label mt-1 block whitespace-nowrap">Night Ledger</span>
            </span>
          </Link>
          <Connect />
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-3">
          <nav aria-label="Floor rooms" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {appLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-testid={link.testId}
                  className={active ? "border-b border-brass pb-1 text-ink" : "border-b border-transparent pb-1 text-ink/55"}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-wrap items-center gap-6">
            {process.env.NEXT_PUBLIC_WALLET_ONLY === "1" ? null : (
              <div className="flex items-center gap-3 text-[11px] tracking-[0.16em]">
                <button
                  type="button"
                  data-testid="chain-anvil"
                  onClick={() => setTable("anvil")}
                  className={table === "anvil" ? "text-brass" : "text-ink/40"}
                >
                  ANVIL
                </button>
                <span className="text-line">/</span>
                <button
                  type="button"
                  data-testid="chain-robinhood"
                  onClick={() => setTable("robinhood")}
                  className={table === "robinhood" ? "text-brass" : "text-ink/40"}
                >
                  ROBINHOOD
                </button>
              </div>
            )}
            {balances ? <p className="text-[11px] tabular tracking-[0.06em] text-ink/70">{balances}</p> : null}
          </div>
        </div>
        <Tape />
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{table === "robinhood" ? <RobinhoodSeat /> : children}</main>
      <Street />
      <footer className="mx-auto max-w-6xl px-6 pb-8 text-[12px] leading-relaxed tracking-[0.02em] text-ink/50">
        <Link href="/guide" className="text-brass">
          Read the guide
        </Link>
        . The pixel and the tape read Robinhood Chain. The desk, the pit, the showroom, and a pass are a practice table. Holding a pass earns nothing. A .hood name points at a wallet and earns nothing. A member card lists the socials you choose. A link is a hello, and it earns nothing. Practice coins stay here. They are not Global Dollar. A Stock Token tracks a price and does not make you a shareholder. Yield on a desk is swap fees plus new STONK, and it is not a promise. A room of{" "}
        <a className="text-brass" href="https://doghood.aibusiness.fun/" target="_blank" rel="noreferrer">
          Night Ledger
        </a>
        . Not a Robinhood product. Your wallet confirms every move.
      </footer>
    </div>
  );
}
