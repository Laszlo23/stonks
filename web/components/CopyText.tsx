"use client";

import { useState } from "react";

type CopyState = "idle" | "done" | "failed";

function copyLabel(state: CopyState): string {
  switch (state) {
    case "idle":
      return "Copy";
    case "done":
      return "Copied";
    case "failed":
      return "Select it";
    default: {
      const neverState: never = state;
      return neverState;
    }
  }
}

export function CopyText({ value }: { value: string }) {
  const [state, setState] = useState<CopyState>("idle");

  return (
    <button
      type="button"
      className="chip shrink-0"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(
          () => setState("done"),
          () => setState("failed"),
        );
        window.setTimeout(() => setState("idle"), 1600);
      }}
    >
      {copyLabel(state)}
    </button>
  );
}
