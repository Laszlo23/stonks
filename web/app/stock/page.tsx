import { ShareBar } from "@/components/ShareBar";
import { stockBoard } from "@/lib/stocks";

export const revalidate = 300;

export default async function StockPage() {
  const rows = await stockBoard();

  return (
    <div>
      <p className="label">Robinhood Chain</p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight sm:text-6xl">A price, not a share</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
        A Stock Token is a debt security from Robinhood Assets in Jersey. It tracks a price. It does not make the holder a shareholder. The United States, the United Kingdom, Canada, and Switzerland are outside the offer.
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">
        This room only reads the list. The swap stays on{" "}
        <a className="text-brass" href="https://dex.aibusiness.fun/">
          the dex
        </a>
        . NVDA and SPY are the examples already on the tape.{" "}
        <a className="text-brass" href="https://docs.robinhood.com/chain/stock-tokens/">
          The docs
        </a>
        .
      </p>
      <ShareBar id="stock" />
      <ul className="mt-8 grid gap-3" data-testid="stock-board">
        {rows.map((row) => (
          <li key={row.ticker} className="panel flex flex-wrap items-baseline justify-between gap-3 p-5">
            <span className="font-serif text-2xl">{row.ticker}</span>
            <a
              className="break-all text-sm text-ink/70"
              href={`https://robinhoodchain.blockscout.com/token/${row.contract}`}
            >
              {row.contract}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
