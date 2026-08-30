"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CATS, findItem, ITEMS } from "./menu";
import { buildSlots, optPrice, optSummary } from "./pricing";
import { loadJSON, removeKey, saveJSON } from "./storage";
import type { CartLine, CookieChoice, GoTo, NavDir, TipPct, View } from "./types";

interface StoreState {
  view: View;
  navDir: NavDir;
  cat: string;
  catFlip: boolean;
  q: string;
  sheetId: string | null;
  sel: Record<string, number>;
  qty: number;
  note: string;
  editIdx: number | null;
  cart: CartLine[];
  favs: string[];
  gotos: GoTo[];
  slot: string | null;
  name: string;
  phone: string;
  tipPct: TipPct;
  cookieChoice: CookieChoice;
  now: Date;
  lastOrderId: string | null;
}

interface StoreActions {
  goHome: () => void;
  goMenu: (cat?: string) => void;
  goSearch: () => void;
  closeSearch: () => void;
  goCheckout: () => void;
  backToMenu: () => void;
  placeOrder: () => void;
  pickCategory: (cat: string) => void;
  setQuery: (q: string) => void;
  openSheet: (id: string, editIdx?: number | null) => void;
  closeSheet: () => void;
  pickChoice: (label: string, idx: number) => void;
  setNote: (note: string) => void;
  qtyUp: () => void;
  qtyDown: () => void;
  addToCart: () => void;
  quickAdd: (goto: GoTo) => void;
  toggleFav: (id: string) => void;
  lineInc: (i: number) => void;
  lineDec: (i: number) => void;
  lineRemove: (i: number) => void;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  pickSlot: (v: string) => void;
  pickTip: (v: TipPct) => void;
  acceptCookies: () => void;
  declineCookies: () => void;
}

type Store = StoreState & StoreActions;

const StoreContext = createContext<Store | null>(null);

const initialState: StoreState = {
  view: "home",
  navDir: null,
  cat: "All",
  catFlip: false,
  q: "",
  sheetId: null,
  sel: {},
  qty: 1,
  note: "",
  editIdx: null,
  cart: [],
  favs: [],
  gotos: [],
  slot: null,
  name: "",
  phone: "",
  tipPct: 0.18,
  cookieChoice: null,
  now: new Date(),
  lastOrderId: null,
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(initialState);
  const hydrated = useRef(false);

  // Tick the clock so pickup windows roll forward.
  useEffect(() => {
    const id = setInterval(() => setState((s) => ({ ...s, now: new Date() })), 60000);
    return () => clearInterval(id);
  }, []);

  // Load persisted state once on mount. tb.consent is always read; the rest
  // only apply once we know the stored consent choice (README §2).
  useEffect(() => {
    const consent = loadJSON<CookieChoice>("tb.consent", null);
    if (!consent) {
      hydrated.current = true;
      return;
    }
    const cart = loadJSON<CartLine[]>("tb.cart", []);
    const patch: Partial<StoreState> = { cookieChoice: consent, cart };
    if (consent === "all") {
      patch.favs = loadJSON<string[]>("tb.favs", []);
      patch.gotos = loadJSON<GoTo[]>("tb.gotos", []);
      const customer = loadJSON<{ name: string; phone: string }>("tb.customer", { name: "", phone: "" });
      patch.name = customer.name;
      patch.phone = customer.phone;
    }
    // One-time sync from localStorage on mount — there's no external-store
    // subscription needed here, just a single read before anything renders meaningfully.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((s) => ({ ...s, ...patch }));
    hydrated.current = true;
  }, []);

  // Persist on change, respecting the consent tier.
  useEffect(() => {
    if (!hydrated.current || !state.cookieChoice) return;
    saveJSON("tb.consent", state.cookieChoice);
    saveJSON("tb.cart", state.cart);
    if (state.cookieChoice === "all") {
      saveJSON("tb.favs", state.favs);
      saveJSON("tb.gotos", state.gotos);
      saveJSON("tb.customer", { name: state.name, phone: state.phone });
    } else {
      removeKey("tb.favs");
      removeKey("tb.gotos");
      removeKey("tb.customer");
    }
  }, [state.cookieChoice, state.cart, state.favs, state.gotos, state.name, state.phone]);

  const scrollTop = useCallback(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const nav = useCallback(
    (patch: Partial<StoreState>) => {
      scrollTop();
      setState((s) => ({ ...s, sheetId: null, ...patch }));
    },
    [scrollTop]
  );

  const actions: StoreActions = useMemo(
    () => ({
      goHome: () => nav({ view: "home", navDir: "back" }),
      goMenu: (cat) => nav({ view: "menu", cat: cat ?? "All", q: "", navDir: "fwd" }),
      goSearch: () => setState((s) => ({ ...s, view: "search", q: "" })),
      closeSearch: () => setState((s) => ({ ...s, view: "menu", q: "" })),
      goCheckout: () => nav({ view: "checkout", navDir: "fwd" }),
      backToMenu: () => nav({ view: "menu", navDir: "back" }),

      placeOrder: () => {
        setState((s) => {
          const gotos = s.cart.reduce<GoTo[]>((acc, line) => {
            const it = findItem(line.id);
            if (!it) return acc;
            const entry: GoTo = { id: line.id, sel: line.sel, label: optSummary(it, line.sel, "") };
            return [entry, ...acc.filter((g) => g.id !== line.id)].slice(0, 3);
          }, s.gotos);

          const slotInfo = buildSlots(s.now);
          const slot = s.slot && slotInfo.slots.includes(s.slot) ? s.slot : slotInfo.slots[0];

          fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: s.name,
              phone: s.phone,
              slot,
              items: s.cart.map((line) => {
                const it = findItem(line.id);
                return {
                  name: it?.name ?? line.id,
                  opts: it ? optSummary(it, line.sel, line.note) : "",
                  qty: line.qty,
                };
              }),
              total: s.cart.reduce((a, l) => {
                const it = findItem(l.id);
                return a + (it ? optPrice(it, l.sel) * l.qty : 0);
              }, 0),
            }),
          })
            .then((r) => r.json())
            .then((data: { orderId?: string }) => {
              if (data.orderId) setState((s2) => ({ ...s2, lastOrderId: data.orderId ?? null }));
            })
            .catch(() => {});

          scrollTop();
          return { ...s, view: "done", cart: [], gotos, slot, sheetId: null };
        });
      },

      pickCategory: (cat) => nav({ cat, q: "", catFlip: !state.catFlip }),
      setQuery: (q) => setState((s) => ({ ...s, q })),

      openSheet: (id, editIdx = null) =>
        setState((s) => {
          const it = findItem(id);
          if (!it) return s;
          const sel: Record<string, number> = {};
          if (editIdx !== null && s.cart[editIdx]) {
            Object.assign(sel, s.cart[editIdx].sel);
          } else {
            it.opts.forEach(([label]) => {
              sel[label] = 0;
            });
          }
          return {
            ...s,
            sheetId: id,
            sel,
            qty: editIdx !== null && s.cart[editIdx] ? s.cart[editIdx].qty : 1,
            note: editIdx !== null && s.cart[editIdx] ? s.cart[editIdx].note : "",
            editIdx,
          };
        }),

      closeSheet: () => setState((s) => ({ ...s, sheetId: null, editIdx: null, note: "", qty: 1 })),

      pickChoice: (label, idx) => setState((s) => ({ ...s, sel: { ...s.sel, [label]: idx } })),
      setNote: (note) => setState((s) => ({ ...s, note })),
      qtyUp: () => setState((s) => ({ ...s, qty: s.qty + 1 })),
      qtyDown: () => setState((s) => ({ ...s, qty: Math.max(1, s.qty - 1) })),

      addToCart: () =>
        setState((s) => {
          if (!s.sheetId) return s;
          const line: CartLine = { id: s.sheetId, sel: { ...s.sel }, qty: s.qty, note: s.note };
          const cart = s.cart.slice();
          if (s.editIdx !== null) cart[s.editIdx] = line;
          else cart.push(line);
          return { ...s, cart, sheetId: null, editIdx: null, note: "", qty: 1 };
        }),

      quickAdd: (goto) =>
        setState((s) => ({
          ...s,
          cart: [...s.cart, { id: goto.id, sel: goto.sel, qty: 1, note: "" }],
        })),

      toggleFav: (id) =>
        setState((s) => ({
          ...s,
          favs: s.favs.includes(id) ? s.favs.filter((f) => f !== id) : [...s.favs, id],
        })),

      lineInc: (i) =>
        setState((s) => {
          const cart = s.cart.slice();
          cart[i] = { ...cart[i], qty: cart[i].qty + 1 };
          return { ...s, cart };
        }),
      lineDec: (i) =>
        setState((s) => {
          const cart = s.cart.slice();
          cart[i] = { ...cart[i], qty: Math.max(1, cart[i].qty - 1) };
          return { ...s, cart };
        }),
      lineRemove: (i) => setState((s) => ({ ...s, cart: s.cart.filter((_, j) => j !== i) })),

      setName: (name) => setState((s) => ({ ...s, name })),
      setPhone: (phone) => setState((s) => ({ ...s, phone })),
      pickSlot: (slot) => setState((s) => ({ ...s, slot })),
      pickTip: (tipPct) => setState((s) => ({ ...s, tipPct })),

      acceptCookies: () => setState((s) => ({ ...s, cookieChoice: "all" })),
      declineCookies: () => setState((s) => ({ ...s, cookieChoice: "essential" })),
    }),
    [nav, scrollTop, state.catFlip]
  );

  const value: Store = { ...state, ...actions };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useCartTotals() {
  const { cart, tipPct } = useStore();
  return useMemo(() => {
    const lines = cart.map((line, i) => {
      const it = findItem(line.id)!;
      const price = optPrice(it, line.sel) * line.qty;
      return { line, item: it, index: i, price };
    });
    const subtotal = lines.reduce((a, l) => a + l.price, 0);
    const count = cart.reduce((a, l) => a + l.qty, 0);
    const tax = subtotal * 0.0775;
    const tip = subtotal * tipPct;
    const total = subtotal + tax + tip;
    return { lines, subtotal, count, tax, tip, total };
  }, [cart, tipPct]);
}

export { ITEMS, CATS };
