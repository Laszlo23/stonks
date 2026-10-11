"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { maxUint256, type Address } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { tokenAbi } from "./abi";
import { anvil } from "./chain";
import { explain } from "./explain";
import { ensureChain } from "./wagmi";

type WriteArgs = Parameters<ReturnType<typeof useWriteContract>["writeContractAsync"]>[0];

export function useMoves() {
  const { address, chainId, connector } = useAccount();
  const publicClient = usePublicClient({ chainId: anvil.id });
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send(args: WriteArgs) {
    const ethereum = (window as Window & { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
    if (connector?.id === "injected" && ethereum) {
      await ensureChain(ethereum as never, anvil.id);
    }
    const hash = await writeContractAsync({ ...args, chainId: anvil.id } as WriteArgs);
    if (!publicClient) throw new Error("The table is not connected.");
    await publicClient.waitForTransactionReceipt({ hash });
  }

  async function approve(token: Address, spender: Address, amount: bigint) {
    if (!address || !publicClient) throw new Error("Connect a wallet first.");
    const allowance = await publicClient.readContract({
      address: token,
      abi: tokenAbi,
      functionName: "allowance",
      args: [address, spender],
    });
    if (allowance >= amount) return;
    await send({
      address: token,
      abi: tokenAbi,
      functionName: "approve",
      args: [spender, maxUint256],
    });
  }

  async function move(label: string, fn: () => Promise<void>) {
    if (!address) {
      setError("Connect a wallet first.");
      return;
    }
    if (chainId && chainId !== anvil.id) {
      setError("Confirm the network in your wallet.");
      return;
    }
    setError(null);
    setPending(label);
    try {
      await fn();
      await queryClient.invalidateQueries();
    } catch (err) {
      setError(explain(err));
    } finally {
      setPending(null);
    }
  }

  return { pending, error, move, send, approve, address };
}
