"use client";

import { useState } from "react";
import { origin, shareTitle, shareUrl, shares, type ShareKey } from "@/lib/share";

type ShareNote = "idle" | "copied" | "link";

function noteLabel(note: ShareNote, url: string): string {
  switch (note) {
    case "idle":
      return "";
    case "copied":
      return "Copied. Paste it anywhere.";
    case "link":
      return url;
    default: {
      const neverNote: never = note;
      return neverNote;
    }
  }
}

export function ShareBar({
  id,
  path,
  title,
  text,
}: {
  id: ShareKey;
  path?: string;
  title?: string;
  text?: string;
}) {
  const item = shares[id];
  const url = path ? `${origin}${path}` : shareUrl(id);
  const spoken = text ?? item.text;
  const named = title ? `${title} · The Floor` : shareTitle(id);
  const line = `${spoken} ${url}`;
  const [note, setNote] = useState<ShareNote>("idle");

  async function onShare() {
    const here = !path && id === "desk" && typeof window !== "undefined" ? window.location.href.split("#")[0] : url;
    const payload = { title: named, text: spoken, url: here };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(payload);
        setNote("idle");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${spoken} ${here}`);
      setNote("copied");
    } catch {
      setNote("link");
    }
  }

  const encoded = encodeURIComponent(line);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button type="button" className="btn-neon" onClick={() => void onShare()}>
        Share
      </button>
      <a className="chip" href={`https://twitter.com/intent/tweet?text=${encoded}`} target="_blank" rel="noreferrer">
        X
      </a>
      <a className="chip" href={`https://warpcast.com/~/compose?text=${encoded}`} target="_blank" rel="noreferrer">
        Farcaster
      </a>
      <a className="chip" href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(spoken)}`} target="_blank" rel="noreferrer">
        Telegram
      </a>
      {note === "idle" ? null : <span className="text-sm text-ink/70">{noteLabel(note, url)}</span>}
    </div>
  );
}
