import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";

import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const title = "How NVIDIA Became the Backbone of the AI Economy";
const description =
  "An interactive business case study of the strategic decisions, financial performance and industry shifts that turned a gaming GPU manufacturer into the world's AI infrastructure layer.";

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: "Business Analytics Case Study" }],
  openGraph: {
    title,
    description,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${inter.variable}`}>
      <body>
        <a
          href="#story"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-ink-inverse"
        >
          Skip to story
        </a>
        {children}
      </body>
    </html>
  );
}
