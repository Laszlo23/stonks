import Link from "next/link";
import { CopyText } from "@/components/CopyText";
import { ShareBar } from "@/components/ShareBar";
import { pageMeta } from "@/lib/share";
import { chapters, steps } from "@/lib/stories";

export const metadata = pageMeta("guide");

const jumps = [
  { href: "#start", label: "Start" },
  { href: "#pixel", label: "Pixel" },
  { href: "#numbers", label: "Numbers" },
  { href: "#desk", label: "Desk" },
  { href: "#words", label: "Words" },
  { href: "#rooms", label: "Rooms" },
  { href: "#grab", label: "Copy" },
] as const;

const rooms = [
  { name: "Book", href: "https://doghood.aibusiness.fun/", note: "The story. The coin, the bow, the seed, the street." },
  { name: "Seats", href: "https://nft.aibusiness.fun/", note: "The pixel mint. This is the real chain." },
  { name: "Names", href: "https://doghood.aibusiness.fun/floor/names", note: "A .hood name points at a wallet. The cover is 0.001 ETH. Holding it earns nothing. If street.hood lapses, the subnames stop resolving." },
  { name: "Floor", href: "https://doghood.aibusiness.fun/floor", note: "You are here. Pixel, numbers, practice desk." },
  { name: "Wire", href: "https://doghood.aibusiness.fun/floor/wire", note: "The news, with the source and the date on each note." },
  { name: "Blog", href: "https://doghood.aibusiness.fun/floor/blog", note: "Night Paper. Robinhood, the pixel, and what the rails can hold." },
  { name: "Pit", href: "https://doghood.aibusiness.fun/floor/pit", note: "Swap play coins. The fee stays in the open desks." },
  { name: "Showroom", href: "https://doghood.aibusiness.fun/floor/showroom", note: "Buy a practice desk, bag and tier included." },
  { name: "Dex", href: "https://dex.aibusiness.fun/", note: "Swaps on the real Robinhood Chain." },
  { name: "Stock", href: "https://doghood.aibusiness.fun/floor/stock", note: "Robinhood stock tokens. A debt security that tracks a price. Not a share. No buy button here." },
  { name: "Keys", href: "https://doghood.aibusiness.fun/floor/keys", note: "A practice pass to a desk. Play USDG. The cover stays with the desk. Holding it earns nothing." },
  { name: "Members", href: "https://doghood.aibusiness.fun/floor/members", note: "A card with the socials you choose. Link another member. A link is a hello. It earns nothing, and it is not a share." },
  { name: "BaseFriend", href: "https://basefriend.tech/", note: "The other keys room, on Base. DEGEN pays. A listed name may not have joined." },
  { name: "Greeting", href: "https://gm.aibusiness.fun/", note: "Say GM on the real chain. A streak, not a payout." },
  { name: "Field", href: "https://mine.aibusiness.fun/", note: "A small field. Three free cuts on this browser." },
  { name: "Hood", href: "https://dex.aibusiness.fun/rfgame", note: "Five castles with a Rare Friend. The HOOD on the score is simulated." },
  { name: "Whale", href: "https://playwhale.io/", note: "A real-money casino and sportsbook. A bet can be lost." },
] as const;

const words = [
  { word: "Pixel", means: "A picture you can mint on Robinhood Chain. It does not pay you." },
  { word: "Tape", means: "Today's numbers, read from the chain and the pools. They move. They are not advice." },
  { word: "Stock token", means: "A token that follows a stock price. Holding it does not make you a shareholder." },
  { word: "USDG on the tape", means: "Global Dollar, the real dollar token on Robinhood Chain." },
  { word: "USDG on a desk", means: "Play money on the practice table. Same name. Different coin." },
  { word: "STONK", means: "The other play coin. A desk needs both coins before it can work." },
  { word: "Desk", means: "Your practice seat. It holds the two play coins." },
  { word: "Shift", means: "The desk is open. While it is open, swap fees can grow the till. Closed, it earns nothing." },
  { word: "Till", means: "The size of the bag. The screen shows a gain only when that size is above the size at open." },
  { word: "Pit", means: "The practice swap. Pay one play coin, receive the other. A small fee stays in the open tills." },
  { word: "Showroom", means: "Where a closed desk is for sale, coins included." },
  { word: "Name", means: "A .hood name. alice.street.hood points at a wallet. Holding it earns nothing. If street.hood is not renewed, the subnames stop resolving." },
  { word: "Pass", means: "A practice key to a desk. The price steps up by five. A 2% cover stays with the desk. Holding it earns nothing." },
  { word: "Paper, brass, ink", means: "The rarity of a desk. Paper is common. Brass takes a quarter more of new STONK. Ink takes half again. The chain rolls it once." },
] as const;

export default function GuidePage() {
  return (
    <article>
      <p className="label">The guide</p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight sm:text-6xl">How this works</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
        Three things live here. Only the pixel uses real money. The numbers are read from Robinhood Chain. The desk is a practice table.         This page says which is which, and what to tap.
      </p>
      <ShareBar id="guide" />
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="On this page">
        {jumps.map((jump) => (
          <a key={jump.href} href={jump.href} className="chip">
            {jump.label}
          </a>
        ))}
      </nav>

      <section id="start" className="mt-12 scroll-mt-6 scroll-mb-24">
        <h2 className="font-serif text-3xl tracking-tight">Start with one</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <StartCard
            kicker="Real"
            title="Take a pixel seat"
            body="0.0001 ETH on Robinhood Chain. Five seats to a wallet. A seat is a picture."
            href="https://nft.aibusiness.fun/"
            action="Open the mint"
          />
          <StartCard
            kicker="Read"
            title="See today's numbers"
            body="The dollar, two stock tokens, and a small $HOOD pool. Each note has a date and a source."
            href="/wire"
            action="Open the wire"
            inside
          />
          <StartCard
            kicker="Practice"
            title="Open a play desk"
            body="Play coins. Your wallet still asks before every move. Nothing here is Global Dollar."
            href="/#desk"
            action="Go to the desk"
            inside
          />
        </div>
      </section>

      <section id="pixel" className="mt-14 scroll-mt-6 scroll-mb-24">
        <p className="label">01 · Real</p>
        <h2 className="mt-2 font-serif text-4xl tracking-tight">The pixel</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink/80">
          TICKPIX is a picture on Robinhood Chain. The public price is 0.0001 ETH. You can take five. The floor shows how many seats are left, and the newest ones. A pixel does not earn, and it is not a share.
        </p>
        <ol className="mt-6 grid list-none gap-3 sm:grid-cols-2">
          <Step n="1" title="Open Seats" body="Use Take a seat on the floor, or the Seats tab." />
          <Step n="2" title="Connect a wallet" body="The mint needs a wallet on Robinhood Chain. Chain id 4663. Gas is ETH." />
          <Step n="3" title="Check the price" body="0.0001 ETH each, plus a little ETH for gas. Five is the most one wallet can take." />
          <Step n="4" title="Confirm" body="The wallet pops a confirmation. If you cancel, nothing is minted." />
          <Step n="5" title="Come back" body="The new seat shows on the floor when the count moves." />
        </ol>
        <a className="btn-neon mt-6" href="https://nft.aibusiness.fun/">
          Take a seat
        </a>
      </section>

      <section id="numbers" className="mt-14 scroll-mt-6 scroll-mb-24">
        <p className="label">02 · Read</p>
        <h2 className="mt-2 font-serif text-4xl tracking-tight">The numbers</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink/80">
          The tape reads Robinhood Chain and the pools while the page is open. A quiet pool is shown as quiet. These numbers are not a tip.
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <Fact k="USDG out" v="How much Global Dollar exists on the chain." />
          <Fact k="Dollar pool, day" v="How much of that dollar traded in the busy pool today." />
          <Fact k="NVDA token" v="The price a token is following for NVDA. You do not own NVDA." />
          <Fact k="SPY token" v="The same idea for SPY. A price, not a share." />
          <Fact k="$HOOD" v="A small pool. If the day volume is $0, the pool was quiet." />
          <Fact k="Block" v="The latest Robinhood Chain block we could read." />
        </dl>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
          Under the numbers are short notes. Each one has a date and a source. Open the note to read the original. The chain slowed, stock tokens showed up, and credit started to use the token. That is the change. It is not a promise that a price goes up.
        </p>
        <Link href="/wire" className="btn-ghost mt-5">
          The whole wire
        </Link>
      </section>

      <section id="desk" className="mt-14 scroll-mt-6 scroll-mb-24">
        <p className="label">03 · Practice</p>
        <h2 className="mt-2 font-serif text-4xl tracking-tight">The desk</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink/80">
          The desk, the pit, and the showroom use play coins. Your wallet will ask to add a network called The Floor, chain id 46631. That is the practice table. Say yes only when you mean to practice. Do not send real ETH or real dollars to it.
        </p>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink/80">
          Every mint, draw, stock, swap, claim, and sale waits for a confirmation. Cancel, and nothing moves. An idle desk earns nothing. The only yield is swap fees plus new STONK, and neither is a promise of profit.
        </p>
        <ol className="mt-6 grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="panel p-5">
              <p className="font-serif text-3xl text-brass">{step.n}</p>
              <h3 className="mt-2 font-serif text-xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{step.body}</p>
            </li>
          ))}
        </ol>
        <Link href="/#desk" className="btn-neon mt-6">
          Open a desk
        </Link>
      </section>

      <section id="words" className="mt-14 scroll-mt-6 scroll-mb-24">
        <p className="label">Words</p>
        <h2 className="mt-2 font-serif text-4xl tracking-tight">What the names mean</h2>
        <dl className="mt-6 divide-y divide-line border-y border-line">
          {words.map((item) => (
            <div key={item.word} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-brass">{item.word}</dt>
              <dd className="text-sm leading-relaxed text-ink/80">{item.means}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="rooms" className="mt-14 scroll-mt-6 scroll-mb-24">
        <p className="label">The street</p>
        <h2 className="mt-2 font-serif text-4xl tracking-tight">Every room</h2>
        <p className="mt-3 max-w-2xl text-ink/75">The lime chip at the bottom names the room you are in. Press it and the street rolls out: the book, the pixel, the name, the desk, the swap, the stock token, the pass, then the member card. After the line, the games sit together: the greeting, the field, the hood, and the whale. Scroll, and it tucks away. Lime means you are there.</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {rooms.map((room) => (
            <li key={room.name} className="panel p-5">
              <a href={room.href} className="font-serif text-2xl tracking-tight text-brass">
                {room.name}
              </a>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{room.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="grab" className="panel mt-14 scroll-mt-6 scroll-mb-24 p-6 sm:p-8">
        <p className="label">Copy</p>
        <h2 className="mt-2 font-serif text-4xl tracking-tight">Addresses you can grab</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
          The first three are on Robinhood Chain. The rest are the practice table. Do not mix them up. Do not send real money to a practice address.
        </p>
        <div className="mt-4">
          <Grab label="Pixel contract · chain 4663" value="0xa1F563AA9AFF537b8D1dD551B4DB9eFc9EC2D117" />
          <Grab label="Real Global Dollar · chain 4663" value="0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168" />
          <Grab label="Pixel mint" value="https://nft.aibusiness.fun/" href="https://nft.aibusiness.fun/" />
          <Grab label="Practice chain id" value="46631" />
          <Grab label="Practice RPC" value="https://doghood.aibusiness.fun/floor/rpc" />
          <Grab label="Practice STONK" value="0x5FbDB2315678afecb367f032d93F642f64180aa3" />
          <Grab label="Practice USDG" value="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" />
        </div>
      </section>

      <section className="mt-14">
        <p className="label">The longer telling</p>
        <h2 className="mt-2 font-serif text-4xl tracking-tight">The night, if you want it</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {chapters.map((chapter) => (
            <figure key={chapter.key} className="panel overflow-hidden">
              <img src={chapter.src} alt="" width={800} height={450} loading="lazy" decoding="async" className="h-40 w-full object-cover" />
              <figcaption className="p-5">
                <p className="label">{chapter.kicker}</p>
                <h3 className="mt-2 font-serif text-2xl tracking-tight">{chapter.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/80">{chapter.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </article>
  );
}

function StartCard({
  kicker,
  title,
  body,
  href,
  action,
  inside = false,
}: {
  kicker: string;
  title: string;
  body: string;
  href: string;
  action: string;
  inside?: boolean;
}) {
  const className = "btn-neon mt-4";
  return (
    <div className="panel flex flex-col p-5">
      <p className="label">{kicker}</p>
      <h3 className="mt-2 font-serif text-2xl tracking-tight">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/75">{body}</p>
      {inside ? (
        <Link href={href} className={className}>
          {action}
        </Link>
      ) : (
        <a href={href} className={className}>
          {action}
        </a>
      )}
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="panel p-5">
      <p className="font-serif text-3xl text-brass">{n}</p>
      <h3 className="mt-2 font-serif text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/75">{body}</p>
    </li>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="panel p-4">
      <dt className="text-[11px] tracking-[0.14em] text-brass">{k}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-ink/80">{v}</dd>
    </div>
  );
}

function Grab({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-3">
      <div className="min-w-0">
        <p className="text-[11px] tracking-[0.14em] text-ink/45">{label}</p>
        {href ? (
          <a href={href} className="mt-1 block break-all text-sm text-brass">
            {value}
          </a>
        ) : (
          <p className="mt-1 break-all text-sm">{value}</p>
        )}
      </div>
      <CopyText value={value} />
    </div>
  );
}
