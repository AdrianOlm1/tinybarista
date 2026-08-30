import raw from "@/data/menu.json";
import { optSummary } from "./pricing";
import type { CategoryMeta, GoTo, MenuItem } from "./types";

// data/menu.json is the single source of drink content — edit it (or swap this
// loader for a fetch("/api/menu")) to change the menu without touching components.
export const CATEGORIES: CategoryMeta[] = raw.categories;
export const ITEMS: MenuItem[] = raw.items as MenuItem[];
export const CATS: string[] = ["All", ...CATEGORIES.map((c) => c.id)];
export const FEATURED: { id: string; tag: string }[] = raw.featured;

export function findItem(id: string): MenuItem | undefined {
  return ITEMS.find((i) => i.id === id);
}

// Placeholder "Your go-to's" so the rail isn't empty on a fresh install/demo.
// Once real orders start coming in, placeOrder() prepends real go-to's ahead
// of these — delete this once there's enough real order history to replace it.
const SEED_GOTOS_RAW: { id: string; sel: Record<string, number> }[] = [
  { id: "cinn", sel: { Size: 0, Milk: 1, "Extra shot": 1 } },
  { id: "straw-matcha", sel: { Size: 1, Milk: 2, "Cold foam": 2 } },
];
export const SEED_GOTOS: GoTo[] = SEED_GOTOS_RAW.map((g) => {
  const item = findItem(g.id)!;
  return { ...g, label: optSummary(item, g.sel, "") };
});

export function imgSrc(img: string | null): string | null {
  return img ? `/img/${img}` : null;
}
