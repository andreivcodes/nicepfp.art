import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

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
      <Head>
        <script defer data-domain="nicepfp.art" src="https://plausible.andreiv.xyz/js/script.js"></script>
      </Head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
