import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

// plausible.andreiv.xyz no longer resolves; load analytics only when configured.
const PLAUSIBLE_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC;

export const metadata: Metadata = {
  title: "nicepfp.art",
  description: "Simple. Free. Unlimited. Forever.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {PLAUSIBLE_SRC && (
        <Script defer data-domain="nicepfp.art" src={PLAUSIBLE_SRC} />
      )}
      <body className={inter.className}>{children}</body>
    </html>
  );
}
