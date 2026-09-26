import type { MenuItem } from "./types";

export const money = (n: number) => "$" + n.toFixed(2);

export function optPrice(item: MenuItem, sel: Record<string, number>): number {
  let p = item.base;
  for (const [label, choices] of item.opts) {
    const idx = sel[label] ?? 0;
    const raw = (choices[idx] || choices[0])[1];
    p += parseFloat(raw.replace("+", "")) || 0;
  }
  return p;
}

export function optSummary(item: MenuItem, sel: Record<string, number>, note: string): string {
  const parts = item.opts
    .map(([label, choices]) => (choices[sel[label] ?? 0] || choices[0])[0])
    .filter((v) => v && v !== "None");
  if (note) parts.push(`"${note}"`);
  return parts.join(" · ") || "as-is";
}
