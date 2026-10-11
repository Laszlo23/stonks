const rooms = [
  { key: "book", label: "Book", href: "https://doghood.aibusiness.fun/" },
  { key: "floor", label: "Floor", href: "https://doghood.aibusiness.fun/floor" },
  { key: "dex", label: "Dex", href: "https://dex.aibusiness.fun/" },
  { key: "gm", label: "GM", href: "https://gm.aibusiness.fun/" },
  { key: "mine", label: "Mine", href: "https://mine.aibusiness.fun/" },
  { key: "seats", label: "Seats", href: "https://nft.aibusiness.fun/" },
] as const;

export function Street() {
  return (
    <nav
      id="hood-street"
      aria-label="Hood Street"
      className="fixed inset-x-0 bottom-0 z-40 flex flex-wrap items-center justify-center gap-1.5 border-t border-[rgba(204,255,0,0.28)] bg-[rgba(5,5,5,0.94)] px-3 py-2 backdrop-blur-md"
    >
      {rooms.map((room) => {
        const current = room.key === "floor";
        return (
          <a
            key={room.key}
            href={room.href}
            aria-current={current ? "page" : undefined}
            className={
              current
                ? "rounded-full bg-brass px-3 py-1.5 text-[11px] tracking-[0.16em] text-ivory"
                : "rounded-full px-3 py-1.5 text-[11px] tracking-[0.16em] text-ink/70"
            }
          >
            {room.label}
          </a>
        );
      })}
    </nav>
  );
}
