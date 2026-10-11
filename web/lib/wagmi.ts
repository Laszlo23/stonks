import { createWalletClient, http, numberToHex, type Address, type EIP1193Provider, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { createConfig, createConnector, http as wagmiHttp } from "wagmi";
import { anvil, anvilRpc, robinhood } from "./chain";

type AnvilPlayerOptions = {
  id: string;
  name: string;
  key: Hex;
};

const RPC = anvilRpc;

function anvilProvider(key: Hex): EIP1193Provider {
  const account = privateKeyToAccount(key);
  const wallet = createWalletClient({
    account,
    chain: anvil,
    transport: http(RPC),
  });
  const transport = http(RPC)({ chain: anvil });

  async function request(args: { method: string; params?: readonly unknown[] }): Promise<unknown> {
    const { method, params } = args;
    if (method === "eth_accounts" || method === "eth_requestAccounts") {
      return [account.address];
    }
    if (method === "eth_chainId") return numberToHex(anvil.id);
    if (method === "wallet_switchEthereumChain" || method === "wallet_revokePermissions") {
      return null;
    }
    if (method === "eth_sendTransaction") {
      const [tx] = (params ?? []) as [{ to?: Address; data?: Hex; value?: Hex; gas?: Hex }];
      return wallet.sendTransaction({
        account,
        chain: anvil,
        to: tx.to,
        data: tx.data,
        value: tx.value ? BigInt(tx.value) : undefined,
        gas: tx.gas ? BigInt(tx.gas) : undefined,
      });
    }
    if (method === "personal_sign") {
      const [message] = (params ?? []) as [Hex];
      return wallet.signMessage({ account, message: { raw: message } });
    }
    return transport.request(args as never);
  }

  return {
    request: request as EIP1193Provider["request"],
    on() {},
    removeListener() {},
  };
}

/** Local Anvil players. The keys are Anvil's published defaults, not secrets. */
export function anvilPlayer(options: AnvilPlayerOptions) {
  const account = privateKeyToAccount(options.key);
  const provider = anvilProvider(options.key);
  let connected = false;

  return createConnector(() => ({
    id: options.id,
    name: options.name,
    type: "anvilPlayer",
    async setup() {},
    async connect() {
      connected = true;
      return { accounts: [account.address], chainId: anvil.id } as never;
    },
    async disconnect() {
      connected = false;
    },
    async getAccounts() {
      return connected ? ([account.address] as const) : [];
    },
    async getChainId() {
      return anvil.id;
    },
    async getProvider() {
      return provider;
    },
    async isAuthorized() {
      return connected;
    },
    async switchChain({ chainId }) {
      if (chainId !== anvil.id) throw new Error("Anvil players sit the local table.");
      return anvil;
    },
    onAccountsChanged() {},
    onChainChanged() {},
    onDisconnect() {},
  }));
}

function getEthereum(): EIP1193Provider | null {
  if (typeof window === "undefined") return null;
  const ethereum = (window as Window & { ethereum?: EIP1193Provider }).ethereum;
  return ethereum ?? null;
}

function browserWallet() {
  return createConnector(() => ({
    id: "injected",
    name: "Wallet",
    type: "injected",
    async setup() {},
    async connect() {
      const provider = getEthereum();
      if (!provider) throw new Error("No browser wallet");
      const accounts = (await provider.request({ method: "eth_requestAccounts" })) as Address[];
      const chainHex = (await provider.request({ method: "eth_chainId" })) as string;
      return { accounts, chainId: Number(chainHex) } as never;
    },
    async disconnect() {},
    async getAccounts() {
      const provider = getEthereum();
      if (!provider) return [];
      return (await provider.request({ method: "eth_accounts" })) as Address[];
    },
    async getChainId() {
      const provider = getEthereum();
      if (!provider) return anvil.id;
      const chainHex = (await provider.request({ method: "eth_chainId" })) as string;
      return Number(chainHex);
    },
    async getProvider() {
      const provider = getEthereum();
      if (!provider) throw new Error("No browser wallet");
      return provider;
    },
    async isAuthorized() {
      const provider = getEthereum();
      if (!provider) return false;
      const accounts = (await provider.request({ method: "eth_accounts" })) as Address[];
      return accounts.length > 0;
    },
    async switchChain({ chainId }) {
      const provider = getEthereum();
      if (!provider) throw new Error("No browser wallet");
      await ensureChain(provider, chainId);
      if (chainId === robinhood.id) return robinhood;
      return anvil;
    },
    onAccountsChanged() {},
    onChainChanged() {},
    onDisconnect() {},
  }));
}

export const PLAYER_A = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as const;
export const PLAYER_B = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" as const;

export async function ensureChain(provider: EIP1193Provider, chainId: number): Promise<void> {
  const chainHex = numberToHex(chainId);
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainHex }],
    });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? Number(error.code) : 0;
    const message = error instanceof Error ? error.message : "";
    const missing = code === 4902 || code === -32603 || /unrecognized|not added|unknown chain/i.test(message);
    if (!missing) throw error;
    const chain = chainId === robinhood.id ? robinhood : anvil;
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: chainHex,
          chainName: chain.name,
          nativeCurrency: chain.nativeCurrency,
          rpcUrls: chain.rpcUrls.default.http,
          blockExplorerUrls: chain.blockExplorers ? [chain.blockExplorers.default.url] : [],
        },
      ],
    });
  }
}

export const config = createConfig({
  chains: [anvil, robinhood],
  connectors: [
    ...(process.env.NEXT_PUBLIC_WALLET_ONLY === "1"
      ? []
      : [
          anvilPlayer({ id: "anvil-player-a", name: "Player A", key: PLAYER_A }),
          anvilPlayer({ id: "anvil-player-b", name: "Player B", key: PLAYER_B }),
        ]),
    browserWallet(),
  ],
  transports: {
    [anvil.id]: wagmiHttp(anvilRpc),
    [robinhood.id]: wagmiHttp("https://rpc.mainnet.chain.robinhood.com"),
  },
  ssr: true,
});
