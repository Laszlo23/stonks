"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { games } from "@/lib/games";

const rooms = [
  { key: "book", label: "Book", href: "https://doghood.aibusiness.fun/" },
  { key: "seats", label: "Seats", href: "https://nft.aibusiness.fun/" },
  { key: "names", label: "Names", href: "https://doghood.aibusiness.fun/floor/names" },
  { key: "floor", label: "Floor", href: "https://doghood.aibusiness.fun/floor" },
  { key: "dex", label: "Dex", href: "https://dex.aibusiness.fun/" },
  { key: "stock", label: "Stock", href: "https://doghood.aibusiness.fun/floor/stock" },
  { key: "keys", label: "Keys", href: "https://doghood.aibusiness.fun/floor/keys" },
  { key: "members", label: "Members", href: "https://doghood.aibusiness.fun/floor/members" },
] as const;

type RoomKey = (typeof rooms)[number]["key"];

function streetHere(pathname: string): RoomKey {
  if (pathname.startsWith("/names")) return "names";
  if (pathname.startsWith("/stock")) return "stock";
  if (pathname.startsWith("/keys")) return "keys";
  if (pathname.startsWith("/members")) return "members";
  return "floor";
}

export const appLinks = [
  { href: "/", label: "Floor", testId: "nav-floor", icon: "floor" },
  { href: "/wire", label: "Wire", testId: "nav-wire", icon: "wire" },
  { href: "/blog", label: "Blog", testId: "nav-blog", icon: "blog" },
  { href: "/guide", label: "Guide", testId: "nav-guide", icon: "guide" },
  { href: "/pit", label: "Pit", testId: "nav-pit", icon: "pit" },
  { href: "/showroom", label: "Showroom", testId: "nav-showroom", icon: "room" },
  { href: "/keys", label: "Keys", testId: "nav-keys", icon: "keys" },
  { href: "/members", label: "Members", testId: "nav-members", icon: "members" },
] as const;

const glyphs: Record<string, string> = {
  book: '<path d="M5 5.5h5.6A2.4 2.4 0 0 1 13 7.9V19a2 2 0 0 0-2-2H5z"/><path d="M19 5.5h-5.6A2.4 2.4 0 0 0 11 7.9V19a2 2 0 0 1 2-2h6z"/>',
  floor: '<path d="M4 9.5h16v8H4z"/><path d="M8 9.5V6.5h8v3M8 17.5v2M16 17.5v2"/>',
  dex: '<path d="M5 8h11M13 5l3 3-3 3"/><path d="M19 16H8M11 13l-3 3 3 3"/>',
  gm: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.5 1.5M16.4 16.4l1.5 1.5M17.9 6.1l-1.5 1.5M7.6 16.4l-1.5 1.5"/>',
  mine: '<path d="M4 16.5 14 6.5l3.5 3.5-10 10z"/><path d="M13 7.5 16.5 4 20 7.5 16.5 11"/>',
  seats: '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="9" y="13.5" width="6.5" height="6.5" rx="1"/>',
  keys: '<circle cx="8" cy="12" r="3.2"/><path d="M11 12h9M17 12v3M20 12v2"/>',
  members: '<circle cx="9" cy="9" r="2.4"/><circle cx="16" cy="9.5" r="2"/><path d="M4.8 18c.7-2.4 2.4-3.6 4.4-3.6s3.6 1.2 4.3 3.6M13.2 14.6c.8-1.4 2-2.1 3.4-2.1 1.6 0 2.8 1 3.4 2.8"/>',
  names: '<path d="M4 8.5h16v7H4z"/><path d="M8 12h5"/>',
  stock: '<path d="M4 16.5 9 11l3 3 8-8"/><path d="M15 6h5v5"/>',
  hood: '<path d="M5 11.5 12 5l7 6.5V19H5z"/><path d="M10 19v-4h4v4"/>',
  casino: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.4"/><path d="M12 4.5v2.4M12 17.1v2.4M4.5 12h2.4M17.1 12h2.4"/>',
  wire: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  blog: '<path d="M6 4.5h8.5L18 8v11.5H6z"/><path d="M14.5 4.5V8H18M8.5 12h7M8.5 15.5h5"/>',
  guide: '<circle cx="12" cy="12" r="8"/><path d="M9.2 9.6a2.8 2.8 0 1 1 3.6 2.7c-.8.3-1.3.9-1.3 1.7V15M12 17.6h.01"/>',
  pit: '<circle cx="9" cy="12" r="4"/><circle cx="15" cy="12" r="4"/>',
  room: '<rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M4 15l4-4 3 3 2.5-3 6.5 6"/>',
};

const PLACE_KEY = "hood-plus-place";

function clampPlace(left: number, bottom: number, node: HTMLElement | null): { left: number; bottom: number } {
  const width = node?.offsetWidth || 120;
  const height = node?.offsetHeight || 36;
  const maxLeft = Math.max(8, window.innerWidth - width - 8);
  const maxBottom = Math.max(8, window.innerHeight - height - 8);
  return {
    left: Math.min(maxLeft, Math.max(8, left)),
    bottom: Math.min(maxBottom, Math.max(8, bottom)),
  };
}

function Mark({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: glyphs[name] ?? "" }} />
  );
}

function otherFooterLift(dock: HTMLElement | null): number {
  if (!dock) return 0;
  let lift = 0;
  for (const el of document.querySelectorAll("nav, footer")) {
    if (dock.contains(el)) continue;
    const css = getComputedStyle(el);
    if (css.position !== "fixed" && css.position !== "sticky") continue;
    if (css.display === "none" || css.visibility === "hidden") continue;
    const rect = el.getBoundingClientRect();
    const wide = rect.width > window.innerWidth * 0.55;
    const low = rect.height >= 40 && rect.bottom >= window.innerHeight - 12 && rect.top >= window.innerHeight - 180;
    if (wide && low) lift = Math.max(lift, Math.round(rect.height));
  }
  return lift;
}

export function Street() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lift, setLift] = useState(0);
  const openedAt = useRef(0);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function measure() {
      const next = otherFooterLift(dockRef.current);
      setLift((current) => (current === next ? current : next));
    }
    measure();
    const observer = new MutationObserver(measure);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    dockRef.current?.querySelector("[aria-current='page']")?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [open, pathname]);

  useEffect(() => {
    let last = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if (open && Date.now() - openedAt.current > 400 && Math.abs(y - last) > 12) setOpen(false);
      last = y;
      const next = otherFooterLift(dockRef.current);
      setLift((current) => (current === next ? current : next));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  const hereKey = streetHere(pathname);
  const here = rooms.find((room) => room.key === hereKey) ?? rooms[3];
  const plusRef = useRef<HTMLButtonElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const [place, setPlace] = useState<{ left: number; bottom: number } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(PLACE_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as { left?: unknown; bottom?: unknown };
      if (typeof saved.left === "number" && typeof saved.bottom === "number") {
        setPlace(clampPlace(saved.left, saved.bottom, plusRef.current));
      }
    } catch {
      localStorage.removeItem(PLACE_KEY);
    }
  }, []);

  useEffect(() => {
    const plus = plusRef.current;
    if (!plus) return;
    const button = plus;
    let startX = 0;
    let startY = 0;
    let originLeft = 0;
    let originBottom = 0;
    let moving = false;
    let tracking = false;
    let spot: { left: number; bottom: number } | null = null;

    function paint(next: { left: number; bottom: number }) {
      spot = next;
      button.style.left = `${next.left}px`;
      button.style.bottom = `${next.bottom}px`;
      button.style.right = "auto";
      button.style.transform = "none";
      button.classList.add("hood-placed");
    }

    function onDown(event: PointerEvent) {
      if (event.button !== 0) return;
      const rect = button.getBoundingClientRect();
      startX = event.clientX;
      startY = event.clientY;
      originLeft = rect.left;
      originBottom = window.innerHeight - rect.bottom;
      moving = false;
      tracking = true;
      button.setPointerCapture(event.pointerId);
    }

    function onMove(event: PointerEvent) {
      if (!tracking) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!moving && Math.hypot(dx, dy) < 6) return;
      moving = true;
      dragged.current = true;
      button.classList.add("hood-drag");
      paint(clampPlace(originLeft + dx, originBottom - dy, button));
    }

    function onUp(event: PointerEvent) {
      if (!tracking) return;
      tracking = false;
      button.classList.remove("hood-drag");
      if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
      if (!moving || !spot) return;
      setPlace(spot);
      localStorage.setItem(PLACE_KEY, JSON.stringify(spot));
    }

    plus.addEventListener("pointerdown", onDown);
    plus.addEventListener("pointermove", onMove);
    plus.addEventListener("pointerup", onUp);
    plus.addEventListener("pointercancel", onUp);
    return () => {
      plus.removeEventListener("pointerdown", onDown);
      plus.removeEventListener("pointermove", onMove);
      plus.removeEventListener("pointerup", onUp);
      plus.removeEventListener("pointercancel", onUp);
    };
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const strip = row;
    let pointer: number | null = null;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    function onWheel(event: WheelEvent) {
      if (strip.scrollWidth <= strip.clientWidth + 1) return;
      const along = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = along ? event.deltaX : event.deltaY;
      if (delta === 0) return;
      event.preventDefault();
      strip.scrollLeft += delta;
    }

    function onDown(event: PointerEvent) {
      if (event.button !== 0) return;
      pointer = event.pointerId;
      startX = event.clientX;
      startLeft = strip.scrollLeft;
      moved = false;
    }

    function onMove(event: PointerEvent) {
      if (pointer !== event.pointerId) return;
      const dx = event.clientX - startX;
      if (!moved && Math.abs(dx) < 8) return;
      moved = true;
      strip.classList.add("hood-scrolling");
      if (!strip.hasPointerCapture(event.pointerId)) strip.setPointerCapture(event.pointerId);
      strip.scrollLeft = startLeft - dx;
    }

    function onUp(event: PointerEvent) {
      if (pointer !== event.pointerId) return;
      pointer = null;
      strip.classList.remove("hood-scrolling");
      if (strip.hasPointerCapture(event.pointerId)) strip.releasePointerCapture(event.pointerId);
    }

    function onClick(event: MouseEvent) {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    }

    strip.addEventListener("wheel", onWheel, { passive: false });
    strip.addEventListener("pointerdown", onDown);
    strip.addEventListener("pointermove", onMove);
    strip.addEventListener("pointerup", onUp);
    strip.addEventListener("pointercancel", onUp);
    strip.addEventListener("click", onClick, true);
    return () => {
      strip.removeEventListener("wheel", onWheel);
      strip.removeEventListener("pointerdown", onDown);
      strip.removeEventListener("pointermove", onMove);
      strip.removeEventListener("pointerup", onUp);
      strip.removeEventListener("pointercancel", onUp);
      strip.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <div id="hood-dock" ref={dockRef} className={open ? "hood-open" : undefined} style={{ ["--hood-lift" as string]: `${lift}px` }}>
      <nav id="hood-street" aria-label="Hood Street" aria-hidden={!open} inert={!open}>
        <div className="hood-row" ref={rowRef}>
          <div className="hood-main">
            {rooms.map((room) => {
              const current = room.key === hereKey;
              return (
                <a key={room.key} href={room.href} aria-current={current ? "page" : undefined}>
                  <Mark name={room.key} />
                  <span>{room.label}</span>
                </a>
              );
            })}
          </div>
          <div className="hood-seam" />
          <nav id="hood-games" aria-label="Games">
            {games.map((game) => (
              <a key={game.key} href={game.href}>
                <Mark name={game.key} />
                <span>{game.label}</span>
              </a>
            ))}
          </nav>
          <div className="hood-seam" />
          <nav id="hood-app" aria-label="This app">
            {appLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined}>
                  <Mark name={link.icon} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </nav>
      <button
        id="hood-plus"
        ref={plusRef}
        type="button"
        className={place ? "hood-placed" : undefined}
        style={place ? { left: place.left, bottom: place.bottom, right: "auto", transform: "none" } : undefined}
        aria-controls="hood-street"
        aria-expanded={open}
        aria-label={open ? "Close the street" : "Open the street"}
        onClick={() => {
          if (dragged.current) {
            dragged.current = false;
            return;
          }
          setOpen((value) => {
            const next = !value;
            if (next) openedAt.current = Date.now();
            return next;
          });
        }}
      >
        <svg className="hood-mark" viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: glyphs[here.key] }} />
        <span className="hood-here">{here.label}</span>
        <span className="hood-add" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
    </div>
  );
}
