import type { Metadata, Viewport } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import { Providers } from "./providers";
import { Shell } from "@/components/Shell";
import { pageMeta } from "@/lib/share";
import "./globals.css";

const serif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif-face",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-face",
  display: "swap",
});

export const metadata: Metadata = {
  ...pageMeta("floor"),
  title: { default: "The Floor · Night Ledger", template: "%s · The Floor" },
  applicationName: "The Floor",
  authors: [{ name: "Night Ledger", url: "https://doghood.aibusiness.fun/" }],
  icons: {
    icon: [{ url: "https://doghood.aibusiness.fun/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "https://doghood.aibusiness.fun/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: { capable: true, title: "The Floor", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#CCFF00",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
