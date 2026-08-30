export type Choice = [name: string, surcharge: string];
export type OptionGroup = [label: string, choices: Choice[], hint: string];

export interface MenuItem {
  id: string;
  cat: string;
  name: string;
  base: number;
  img: string | null;
  blurb: string;
  opts: OptionGroup[];
}

export interface CategoryMeta {
  id: string;
  script: string;
  sub: string;
  note?: string;
}

export interface CartLine {
  id: string;
  sel: Record<string, number>;
  qty: number;
  note: string;
}

export interface GoTo {
  id: string;
  sel: Record<string, number>;
  label: string;
}

export type View = "home" | "menu" | "search" | "checkout" | "done";
export type NavDir = "fwd" | "back" | null;
export type TipPct = 0 | 0.12 | 0.18 | 0.22;
export type CookieChoice = "all" | "essential" | null;

export interface OrderRecord {
  id: string;
  name: string;
  phone: string;
  slot: string;
  items: { name: string; opts: string; qty: number }[];
  total: number;
  status: "placed" | "ready";
  createdAt: string;
}
