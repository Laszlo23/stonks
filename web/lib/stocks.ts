export type StockRow = {
  ticker: string;
  contract: `0x${string}`;
};

const order = ["NVDA", "SPY", "AAPL", "TSLA", "MSFT", "AMZN", "META", "GOOGL"] as const;

const fallback: StockRow[] = [
  { ticker: "NVDA", contract: "0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC" },
  { ticker: "SPY", contract: "0x117cc2133c37B721F49dE2A7a74833232B3B4C0C" },
  { ticker: "AAPL", contract: "0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9" },
  { ticker: "TSLA", contract: "0x322F0929c4625eD5bAd873c95208D54E1c003b2d" },
  { ticker: "MSFT", contract: "0xe93237C50D904957Cf27E7B1133b510C669c2e74" },
  { ticker: "AMZN", contract: "0x12f190a9F9d7D37a250758b26824B97CE941bF54" },
  { ticker: "META", contract: "0xc0D6457C16Cc70d6790Dd43521C899C87ce02f35" },
  { ticker: "GOOGL", contract: "0x2e0847E8910a9732eB3fb1bB4b70a580ADAD4FE3" },
];

type Asset = {
  tokenSymbol?: string;
  deployments?: { contractAddress?: string; chainId?: number }[];
};

function isAddress(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export async function stockBoard(): Promise<StockRow[]> {
  try {
    const response = await fetch("https://api.robinhood.com/rhj/assets", {
      headers: { accept: "application/json" },
      next: { revalidate: 300 },
    });
    if (!response.ok) return fallback;
    const body = (await response.json()) as { assets?: Asset[] };
    const by = new Map<string, `0x${string}`>();
    for (const asset of body.assets ?? []) {
      const ticker = asset.tokenSymbol;
      const deployment = asset.deployments?.find((item) => item.chainId === 4663);
      const contract = deployment?.contractAddress;
      if (!ticker || !contract || !isAddress(contract)) continue;
      by.set(ticker, contract);
    }
    const rows = order.flatMap((ticker) => {
      const contract = by.get(ticker);
      return contract ? [{ ticker, contract }] : [];
    });
    return rows.length >= 2 ? rows : fallback;
  } catch {
    return fallback;
  }
}
