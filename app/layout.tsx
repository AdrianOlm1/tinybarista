import type { Metadata, Viewport } from "next";
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

// Locks pinch/double-tap zoom. This is the guaranteed fix for the mobile
// "zoom jump" on navigation — whatever was momentarily triggering the browser's
// zoom (font swap, animation, tap timing), the page simply can't scale now.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jost.variable} ${pinyon.variable}`}>
      <body>{children}</body>
    </html>
  );
}
