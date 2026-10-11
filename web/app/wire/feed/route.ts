import { createPublicClient, formatUnits, http } from "viem";

export const revalidate = 30;
import { robinhood } from "@/lib/chain";
import { wireItems } from "@/lib/wire";

const usdg = "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168" as const;
const hoodPool = "0xf27827ca8600e5c79b371f5b30e5a0e889bc7c44";
const spyPool = "0xddcbba3666f578e3f09516f21ff85bfee859ab5e";
const usdgPool = "0x52e65b17fb6e5ba00ed806f37afcd2daa50271ca";
const nvda = "0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec";

const supplyAbi = [
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

type PoolSnap = { priceUsd: string | null; volume24hUsd: string | null; poolUsd: string | null };

async function gecko(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: { accept: "application/json" }, next: { revalidate: 60 } });
  if (!response.ok) throw new Error("gecko");
  return response.json();
}

function poolSnap(body: unknown): PoolSnap {
  const attributes = (
    body as {
      data?: { attributes?: { base_token_price_usd?: string; reserve_in_usd?: string; volume_usd?: { h24?: string } } };
    }
  ).data?.attributes;
  return {
    priceUsd: attributes?.base_token_price_usd ?? null,
    volume24hUsd: attributes?.volume_usd?.h24 ?? null,
    poolUsd: attributes?.reserve_in_usd ?? null,
  };
}

export async function GET() {
  const client = createPublicClient({ chain: robinhood, transport: http() });
  const [block, gas, supply, hoodBody, spyBody, dollarBody, nvdaBody] = await Promise.all([
    client.getBlockNumber().catch(() => null),
    client.getGasPrice().catch(() => null),
    client.readContract({ address: usdg, abi: supplyAbi, functionName: "totalSupply" }).catch(() => null),
    gecko(`https://api.geckoterminal.com/api/v2/networks/robinhood/pools/${hoodPool}`).catch(() => null),
    gecko(`https://api.geckoterminal.com/api/v2/networks/robinhood/pools/${spyPool}`).catch(() => null),
    gecko(`https://api.geckoterminal.com/api/v2/networks/robinhood/pools/${usdgPool}`).catch(() => null),
    gecko(`https://api.geckoterminal.com/api/v2/networks/robinhood/tokens/${nvda}`).catch(() => null),
  ]);

  const nvdaAttr = (
    nvdaBody as { data?: { attributes?: { price_usd?: string; volume_usd?: { h24?: string } } } } | null
  )?.data?.attributes;
  const hood = hoodBody ? poolSnap(hoodBody) : { priceUsd: null, volume24hUsd: null, poolUsd: null };
  const spy = spyBody ? poolSnap(spyBody) : { priceUsd: null, volume24hUsd: null, poolUsd: null };
  const dollar = dollarBody ? poolSnap(dollarBody) : { priceUsd: null, volume24hUsd: null, poolUsd: null };

  return Response.json({
    readAt: new Date().toISOString(),
    chain: {
      block: block === null ? null : Number(block),
      gasGwei: gas === null ? null : Number(formatUnits(gas, 9)),
      usdg: supply === null ? null : Number(formatUnits(supply, 6)),
    },
    hood,
    spy,
    nvda: { priceUsd: nvdaAttr?.price_usd ?? null, volume24hUsd: nvdaAttr?.volume_usd?.h24 ?? null },
    dollar,
    items: wireItems,
  }, { headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=45" } });
}
