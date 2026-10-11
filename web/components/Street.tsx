"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const rooms = [
  { key: "book", label: "Book", href: "https://doghood.aibusiness.fun/" },
  { key: "floor", label: "Floor", href: "https://doghood.aibusiness.fun/floor" },
  { key: "dex", label: "Dex", href: "https://dex.aibusiness.fun/" },
  { key: "gm", label: "GM", href: "https://gm.aibusiness.fun/" },
  { key: "mine", label: "Mine", href: "https://mine.aibusiness.fun/" },
  { key: "seats", label: "Seats", href: "https://nft.aibusiness.fun/" },
] as const;

const appLinks = [
  { href: "/", label: "Floor", testId: "nav-floor", icon: "floor" },
  { href: "/pit", label: "Pit", testId: "nav-pit", icon: "pit" },
  { href: "/showroom", label: "Showroom", testId: "nav-showroom", icon: "room" },
] as const;

const glyphs: Record<string, string> = {
  book: '<path d="M5 5.5h5.6A2.4 2.4 0 0 1 13 7.9V19a2 2 0 0 0-2-2H5z"/><path d="M19 5.5h-5.6A2.4 2.4 0 0 0 11 7.9V19a2 2 0 0 1 2-2h6z"/>',
  floor: '<path d="M4 9.5h16v8H4z"/><path d="M8 9.5V6.5h8v3M8 17.5v2M16 17.5v2"/>',
  dex: '<path d="M5 8h11M13 5l3 3-3 3"/><path d="M19 16H8M11 13l-3 3 3 3"/>',
  gm: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.5 1.5M16.4 16.4l1.5 1.5M17.9 6.1l-1.5 1.5M7.6 16.4l-1.5 1.5"/>',
  mine: '<path d="M4 16.5 14 6.5l3.5 3.5-10 10z"/><path d="M13 7.5 16.5 4 20 7.5 16.5 11"/>',
  seats: '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="9" y="13.5" width="6.5" height="6.5" rx="1"/>',
  pit: '<circle cx="9" cy="12" r="4"/><circle cx="15" cy="12" r="4"/>',
  room: '<rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M4 15l4-4 3 3 2.5-3 6.5 6"/>',
};

function Mark({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: glyphs[name] ?? "" }} />
  );
}

export function Street() {
  const pathname = usePathname();

  return (
    <nav id="hood-street" aria-label="Hood Street">
      <div className="hood-row">
        <div className="hood-main">
          {rooms.map((room) => {
            const current = room.key === "floor";
            return (
              <a key={room.key} href={room.href} aria-current={current ? "page" : undefined}>
                <Mark name={room.key} />
                <span>{room.label}</span>
              </a>
            );
          })}
        </div>
        <div className="hood-seam" />
        <nav id="hood-app" aria-label="This app">
          {appLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-testid={link.testId}
                aria-current={active ? "page" : undefined}
              >
                <Mark name={link.icon} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </nav>
  );
}
