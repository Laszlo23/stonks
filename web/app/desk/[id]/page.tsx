"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { tierArt } from "@/lib/art";
import { addresses, deskContract, pitContract, showroomContract } from "@/lib/contracts";
import { deskNumber, formatAmount, parseAmount } from "@/lib/format";
import { statusLabel, tierLabel, tierNote } from "@/lib/types";
import { gainOf, held, isMine, tillOf, useFloor } from "@/lib/useFloor";
import { useMoves } from "@/lib/useMoves";

export default function DeskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <DeskRoom id={id} />;
}

function DeskRoom({ id }: { id: string }) {
  const numeric = /^\d+$/.test(id) ? BigInt(id) : null;
  const { address } = useAccount();
  const { desks, ready } = useFloor();
  const desk = desks.find((item) => item.id === numeric);

  if (!ready) return <p>Looking for the desk.</p>;
  if (!desk || numeric === null) return <p>No desk with that number.</p>;

  const bag = held(desk);
  const till = tillOf(desk);
  const gain = gainOf(desk);
  const mine = isMine(desk, address);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[20rem_minmax(0,36rem)]">
      <img src={tierArt(desk.tier)} alt="" className="panel h-96 w-full object-cover" />
      <div>
      <Link href="/" className="label">
        Back to the floor
      </Link>
      <div className="mt-4 flex items-end justify-between gap-4">
        <h1 className="font-serif text-5xl tracking-tight">Desk {deskNumber(desk.id)}</h1>
        <p className="chip">{tierLabel(desk.tier)}</p>
      </div>
      <p className="mt-3 text-ink/70">{tierNote(desk.tier)}</p>
      <p className="mt-6 text-[11px] tracking-[0.16em]">{statusLabel(desk.status).toUpperCase()}</p>
      <p data-testid={`till-${id}`} className="mt-3 font-serif text-6xl tabular tracking-tight">
        {formatAmount(till)}
      </p>
      <p className="text-[11px] tracking-[0.14em] text-ink/50">TILL</p>
      {gain > 0n ? (
        <p data-testid={`gain-${id}`} className="mt-2 text-sm text-gain tabular">
          +{formatAmount(gain)} from fees
        </p>
      ) : null}
      <dl className="mt-6 max-w-xs space-y-1 text-sm tabular">
        <div className="flex justify-between">
          <dt className="text-ink/50">USDG</dt>
          <dd>{formatAmount(bag.usdg)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink/50">STONK</dt>
          <dd>{formatAmount(bag.stonk)}</dd>
        </div>
      </dl>

      {desk.status === "onShift" && mine ? (
        <ShiftActions id={desk.id} claimable={desk.claimable} />
      ) : null}
      {desk.status === "onShift" ? (
        <p className="mt-6 max-w-md leading-relaxed">This desk is on shift. Close the shift before you stock it or sell it.</p>
      ) : null}
      {desk.status === "idle" && mine ? <IdleActions id={desk.id} bagUsdg={bag.usdg} bagStonk={bag.stonk} /> : null}
      {desk.status === "listed" && mine ? <p className="mt-6">Asked {formatAmount(desk.price)} USDG.</p> : null}
      {desk.status === "listed" && !mine ? (
        <p className="mt-6">
          This desk is in the <Link href="/showroom">showroom</Link>.
        </p>
      ) : null}
      {!mine && desk.status !== "listed" ? <p className="mt-6">This desk belongs to someone else.</p> : null}
      </div>
    </div>
  );
}

function ShiftActions({ id, claimable }: { id: bigint; claimable: bigint }) {
  const { pending, error, move, send } = useMoves();
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <button
        type="button"
        data-testid={`shift-${id}`}
        disabled={pending !== null}
        className="btn-neon"
        onClick={() =>
          move("Closing…", async () => {
            await send({ ...pitContract, functionName: "closeShift", args: [id] });
          })
        }
      >
        {pending === "Closing…" ? "Closing…" : "Close shift"}
      </button>
      <button
        type="button"
        data-testid={`claim-${id}`}
        disabled={pending !== null || claimable === 0n}
        className="btn-ghost"
        onClick={() =>
          move("Claiming…", async () => {
            await send({ ...pitContract, functionName: "claim", args: [id] });
          })
        }
      >
        {pending === "Claiming…" ? "Claiming…" : `Claim ${formatAmount(claimable)}`}
      </button>
      {error ? <p className="w-full text-[11px]">{error}</p> : null}
    </div>
  );
}

function IdleActions({ id, bagUsdg, bagStonk }: { id: bigint; bagUsdg: bigint; bagStonk: bigint }) {
  const [depositUsdg, setDepositUsdg] = useState("");
  const [depositStonk, setDepositStonk] = useState("");
  const [withdrawUsdg, setWithdrawUsdg] = useState("");
  const [withdrawStonk, setWithdrawStonk] = useState("");
  const [price, setPrice] = useState("");
  const { pending, error, move, send, approve } = useMoves();
  const stocked = bagUsdg > 0n && bagStonk > 0n;
  const usdgIn = parseAmount(depositUsdg) ?? 0n;
  const stonkIn = parseAmount(depositStonk) ?? 0n;
  const usdgOut = parseAmount(withdrawUsdg) ?? 0n;
  const stonkOut = parseAmount(withdrawStonk) ?? 0n;
  const ask = parseAmount(price);

  return (
    <div className="mt-10 space-y-10">
      {stocked ? (
        <button
          type="button"
          data-testid={`shift-${id}`}
          disabled={pending !== null}
          className="btn-neon"
          onClick={() =>
            move("Opening…", async () => {
              await send({ ...pitContract, functionName: "openShift", args: [id] });
            })
          }
        >
          {pending === "Opening…" ? "Opening…" : "Open shift"}
        </button>
      ) : null}
      <p className="max-w-md text-sm leading-relaxed text-ink/70">
        If the bag is off the pit&apos;s ratio, the extra comes back to you when the shift opens.
      </p>
      <form
        className="panel grid gap-3 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          move("Stocking…", async () => {
            if (usdgIn > 0n) await approve(addresses.usdg, addresses.desk, usdgIn);
            if (stonkIn > 0n) await approve(addresses.stonk, addresses.desk, stonkIn);
            await send({ ...deskContract, functionName: "deposit", args: [id, usdgIn, stonkIn] });
          });
        }}
      >
        <p className="label">Stock</p>
        <label className="text-[11px] text-ink/50" htmlFor="deposit-usdg">
          USDG
        </label>
        <input
          id="deposit-usdg"
          data-testid="deposit-usdg"
          value={depositUsdg}
          inputMode="decimal"
          onChange={(event) => setDepositUsdg(event.target.value)}
          className="border-b border-line bg-transparent font-serif text-3xl tabular outline-none"
        />
        <label className="text-[11px] text-ink/50" htmlFor="deposit-stonk">
          STONK
        </label>
        <input
          id="deposit-stonk"
          data-testid="deposit-stonk"
          value={depositStonk}
          inputMode="decimal"
          onChange={(event) => setDepositStonk(event.target.value)}
          className="border-b border-line bg-transparent font-serif text-3xl tabular outline-none"
        />
        <button
          type="submit"
          data-testid="deposit-button"
          disabled={pending !== null || (usdgIn === 0n && stonkIn === 0n)}
          className="btn-neon mt-2"
        >
          {pending === "Stocking…" ? "Stocking…" : "Put it in the bag"}
        </button>
      </form>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          move("Withdrawing…", async () => {
            await send({ ...deskContract, functionName: "withdraw", args: [id, usdgOut, stonkOut] });
          });
        }}
      >
        <p className="label">Withdraw</p>
        <input
          data-testid="withdraw-usdg"
          aria-label="Withdraw USDG"
          value={withdrawUsdg}
          inputMode="decimal"
          placeholder="USDG"
          onChange={(event) => setWithdrawUsdg(event.target.value)}
          className="border-b border-line bg-transparent font-serif text-3xl tabular outline-none"
        />
        <input
          data-testid="withdraw-stonk"
          aria-label="Withdraw STONK"
          value={withdrawStonk}
          inputMode="decimal"
          placeholder="STONK"
          onChange={(event) => setWithdrawStonk(event.target.value)}
          className="border-b border-line bg-transparent font-serif text-3xl tabular outline-none"
        />
        <button
          type="submit"
          data-testid="withdraw-button"
          disabled={pending !== null || (usdgOut === 0n && stonkOut === 0n)}
          className="btn-ghost"
        >
          {pending === "Withdrawing…" ? "Withdrawing…" : "Take from the bag"}
        </button>
      </form>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (ask === null || ask === 0n) return;
          move("Listing…", async () => {
            await send({ ...showroomContract, functionName: "list", args: [id, ask] });
          });
        }}
      >
        <p className="label">Sell</p>
        <input
          data-testid="list-price"
          aria-label="Ask in USDG"
          value={price}
          inputMode="decimal"
          placeholder="Ask in USDG"
          onChange={(event) => setPrice(event.target.value)}
          className="border-b border-line bg-transparent font-serif text-3xl tabular outline-none"
        />
        <button
          type="submit"
          data-testid="list-button"
          disabled={pending !== null || ask === null || ask === 0n}
          className="btn-ghost"
        >
          {pending === "Listing…" ? "Listing…" : "List the desk"}
        </button>
      </form>
      {error ? <p className="text-[11px]">{error}</p> : null}
    </div>
  );
}
