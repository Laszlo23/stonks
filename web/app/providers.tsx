"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import type { Table } from "@/lib/chain";
import { config } from "@/lib/wagmi";

type TableContextValue = {
  table: Table;
  setTable: (table: Table) => void;
};

const TableContext = createContext<TableContextValue | null>(null);

export function useTable(): TableContextValue {
  const value = useContext(TableContext);
  if (!value) throw new Error("Table missing");
  return value;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [table, setTable] = useState<Table>("anvil");

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TableContext.Provider value={{ table, setTable }}>{children}</TableContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
