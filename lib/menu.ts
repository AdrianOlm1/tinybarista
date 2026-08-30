import raw from "@/data/menu.json";
import type { MenuItem, CategoryMeta } from "./types";

// data/menu.json is the single source of drink content — edit it (or swap this
// loader for a fetch("/api/menu")) to change the menu without touching components.
export const CATEGORIES: CategoryMeta[] = raw.categories;
export const ITEMS: MenuItem[] = raw.items as MenuItem[];
export const CATS: string[] = ["All", ...CATEGORIES.map((c) => c.id)];
export const FEATURED: { id: string; tag: string }[] = raw.featured;

export function findItem(id: string): MenuItem | undefined {
  return ITEMS.find((i) => i.id === id);
}

export function imgSrc(img: string | null): string | null {
  return img ? `/img/${img}` : null;
}
