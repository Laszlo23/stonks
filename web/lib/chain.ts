import { defineChain } from "viem";
import { foundry } from "viem/chains";

export const anvilRpc = process.env.NEXT_PUBLIC_ANVIL_RPC || "http://127.0.0.1:8545";
export const floorChainId = Number(process.env.NEXT_PUBLIC_ANVIL_CHAIN_ID || "31337");

export const anvil = defineChain({
  ...foundry,
  id: floorChainId,
  name: "The Floor",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [anvilRpc] },
  },
});

export const robinhood = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.mainnet.chain.robinhood.com"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://robinhoodchain.blockscout.com",
    },
  },
});

export type Table = "anvil" | "robinhood";
