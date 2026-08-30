import type { Metadata } from "next";
import { Jost, Pinyon_Script } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Tiny Baristas — Order Ahead",
  description:
    "Family-run, pickup-only coffee in Yucaipa, CA. Order ahead, skip the wait — ready in about 12 minutes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jost.variable} ${pinyon.variable}`}>
      <body>{children}</body>
    </html>
  );
}
