"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortAddress } from "@/lib/format";

export function Connect() {
  const { address, isConnected, connector } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function sit(id: string) {
    const next = connectors.find((item) => item.id === id);
    if (!next) return;
    setError(null);
    try {
      if (isConnected) await disconnectAsync();
      await connectAsync({ connector: next, chainId: 31337 });
    } catch {
      setError("Could not sit down.");
    }
  }

  const active = mounted && isConnected ? connector?.id : undefined;

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <SeatButton
          testId="connect-a"
          label="A"
          title="Player A"
          active={active === "anvil-player-a"}
          disabled={isPending}
          onClick={() => sit("anvil-player-a")}
        />
        <SeatButton
          testId="connect-b"
          label="B"
          title="Player B"
          active={active === "anvil-player-b"}
          disabled={isPending}
          onClick={() => sit("anvil-player-b")}
        />
        <button
          type="button"
          data-testid="connect-wallet"
          disabled={isPending}
          onClick={() => sit("injected")}
          className={`rounded-full px-3 py-1.5 text-[11px] tracking-[0.14em] disabled:opacity-40 ${
            active === "injected" ? "bg-brass text-ivory" : "border border-[rgba(204,255,0,0.35)] bg-[rgba(204,255,0,0.08)] text-brass"
          }`}
        >
          WALLET
        </button>
      </div>
      <p className="text-[11px] tracking-[0.08em] text-ink/70">
        {mounted && address ? shortAddress(address) : "Sit a player"}
        {error ? ` · ${error}` : ""}
      </p>
    </div>
  );
}

function SeatButton({
  label,
  title,
  active,
  disabled,
  onClick,
  testId,
}: {
  label: string;
  title: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      title={title}
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      className={`h-9 w-9 rounded-full text-sm disabled:opacity-40 ${
        active ? "bg-brass text-ivory" : "border border-line bg-transparent text-ink"
      }`}
    >
      {label}
    </button>
  );
}
