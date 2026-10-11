import { createPublicClient, http, zeroAddress, type Address } from "viem";

export const revalidate = 30;
import { robinhood } from "@/lib/chain";

const tickpix = "0xa1F563AA9AFF537b8D1dD551B4DB9eFc9EC2D117" as const;
const hoodPool = "0xf27827ca8600e5c79b371f5b30e5a0e889bc7c44";

const tickpixAbi = [
  { type: "function", name: "phase", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "totalMinted", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "ownerOf", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "address" }] },
  { type: "function", name: "publicPrice", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

const transferEvent = {
  type: "event",
  name: "Transfer",
  inputs: [
    { name: "from", type: "address", indexed: true },
    { name: "to", type: "address", indexed: true },
    { name: "tokenId", type: "uint256", indexed: true },
  ],
} as const;

type Phase = "Closed" | "Honorary" | "Allowlist" | "Public";

function phaseName(value: number): Phase | "Unknown" {
  switch (value) {
    case 0:
      return "Closed";
    case 1:
      return "Honorary";
    case 2:
      return "Allowlist";
    case 3:
      return "Public";
    default:
      return "Unknown";
  }
}

function short(address: Address): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export async function GET() {
  const client = createPublicClient({ chain: robinhood, transport: http() });
  const [phaseRaw, mintedRaw, priceRaw, block] = await Promise.all([
    client.readContract({ address: tickpix, abi: tickpixAbi, functionName: "phase" }),
    client.readContract({ address: tickpix, abi: tickpixAbi, functionName: "totalMinted" }),
    client.readContract({ address: tickpix, abi: tickpixAbi, functionName: "publicPrice" }),
    client.getBlockNumber(),
  ]);
  const minted = Number(mintedRaw);
  const phase = phaseName(Number(phaseRaw));

  const latestIds = Array.from({ length: Math.min(6, minted) }, (_, index) => minted - index).filter((id) => id > 0);
  const owners = await Promise.all(
    latestIds.map(async (id) => {
      try {
        const owner = await client.readContract({
          address: tickpix,
          abi: tickpixAbi,
          functionName: "ownerOf",
          args: [BigInt(id)],
        });
        return { id, owner };
      } catch {
        return null;
      }
    }),
  );

  let fresh: { id: string; to: string; tx: string }[] = [];
  try {
    const logs = await client.getLogs({
      address: tickpix,
      event: transferEvent,
      fromBlock: block > 400_000n ? block - 400_000n : 0n,
      toBlock: block,
    });
    fresh = logs
      .filter((log) => log.args.from === zeroAddress && log.args.tokenId !== undefined && log.args.to)
      .slice(-6)
      .reverse()
      .map((log) => ({
        id: log.args.tokenId!.toString(),
        to: short(log.args.to!),
        tx: log.transactionHash ?? "",
      }));
  } catch {
    fresh = [];
  }

  let hood = { priceUsd: null as string | null, poolUsd: null as string | null, volume24hUsd: null as string | null };
  try {
    const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/robinhood/pools/${hoodPool}`, {
      headers: { accept: "application/json" },
      next: { revalidate: 30 },
    });
    if (response.ok) {
      const body = (await response.json()) as {
        data?: { attributes?: { base_token_price_usd?: string; reserve_in_usd?: string; volume_usd?: { h24?: string } } };
      };
      const attributes = body.data?.attributes;
      hood = {
        priceUsd: attributes?.base_token_price_usd ?? null,
        poolUsd: attributes?.reserve_in_usd ?? null,
        volume24hUsd: attributes?.volume_usd?.h24 ?? null,
      };
    }
  } catch {
    hood = { priceUsd: null, poolUsd: null, volume24hUsd: null };
  }

  return Response.json(
    {
      pixel: {
        phase,
        minted,
        supply: 4663,
        publicWei: priceRaw.toString(),
        seats: "https://nft.aibusiness.fun/",
      },
      hood,
      seats: owners.flatMap((seat) => (seat ? [{ id: seat.id, owner: short(seat.owner) }] : [])),
      fresh,
    },
    { headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=45" } },
  );
}
