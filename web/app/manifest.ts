import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Floor · Night Ledger",
    short_name: "The Floor",
    description: "A pixel seat, today's chain numbers, and a practice desk.",
    start_url: "https://doghood.aibusiness.fun/floor",
    scope: "https://doghood.aibusiness.fun/floor",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#CCFF00",
    lang: "en",
    icons: [
      {
        src: "https://doghood.aibusiness.fun/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "https://doghood.aibusiness.fun/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
