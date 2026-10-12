import { pageMeta } from "@/lib/share";

export const metadata = pageMeta("stock");

export default function StockLayout({ children }: { children: React.ReactNode }) {
  return children;
}
