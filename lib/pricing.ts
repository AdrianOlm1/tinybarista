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

const OPEN_MIN = 7 * 60;
const CLOSE_MIN = 13 * 60 + 30;

// Pickup slots roll forward from the real clock: next 15-min mark after a 12-min
// prep window, capped at closing. A real launch would also check a per-slot order
// cap (see README §4 — capacity isn't solved here).
export function buildSlots(now: Date): { closed: boolean; slots: string[] } {
  const cur = now.getHours() * 60 + now.getMinutes();
  const out: string[] = [];
  const t = Math.ceil((cur + 12) / 15) * 15;
  const start = Math.max(t, OPEN_MIN);
  const closed = cur < OPEN_MIN - 12 || cur > CLOSE_MIN - 12;
  for (let m = start; m <= CLOSE_MIN && out.length < 6; m += 15) {
    const hr = Math.floor(m / 60);
    const mn = m % 60;
    const h12 = ((hr + 11) % 12) + 1;
    out.push(`${h12}:${String(mn).padStart(2, "0")} ${hr < 12 ? "AM" : "PM"}`);
  }
  if (closed) {
    return {
      closed: true,
      slots: ["Tomorrow · 7:00 AM", "Tomorrow · 7:15 AM", "Tomorrow · 7:30 AM", "Tomorrow · 7:45 AM"],
    };
  }
  return { closed: false, slots: ["ASAP · 12 min", ...out] };
}
