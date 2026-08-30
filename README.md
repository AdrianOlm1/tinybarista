# Tiny Baristas — order-ahead demo

A Next.js/React rebuild of the [design handoff](../design_handoff_tiny_baristas/README.md) prototype: home page, order menu, search, drink customization, and checkout with tipping — built for a click-through demo at **tb.adrianolm.com**.

## What's implemented

All 8 screens from the design handoff, matched closely to its tokens (color, type, spacing, motion):

- **Home** — hero, status strip, $5 Specials coupon, weekly favorites, sisters' story, visit info, footer
- **Order menu** — sticky category chips, saved go-to's, photo cards, favoriting
- **Customize sheet** — one-tap option chips with live pricing (centered modal on desktop, bottom sheet on phone)
- **Search** — full-screen overlay, quick chips, substring match across name/blurb/category
- **Checkout** — editable line items, clock-aware pickup windows, tipping, totals
- **Cookie consent** — gates what gets saved to `localStorage`

Responsive behavior uses real CSS media queries at 768px (no device-toggle hack from the prototype).

### Wiring (per the handoff's priority order)

1. **Menu data** — [data/menu.json](data/menu.json) is the single source for drinks/categories/pricing. [lib/menu.ts](lib/menu.ts) loads it; [app/api/menu/route.ts](app/api/menu/route.ts) also serves it over HTTP if you'd rather fetch than import.
2. **Local persistence** — [lib/store.tsx](lib/store.tsx) saves favorites, go-to's, customer name/phone, and the cart to `localStorage`, gated by the cookie choice ("essentials only" keeps just the cart). Nothing is read from storage before consent.
3. **Fake orders** — `POST /api/orders` ([route.ts](app/api/orders/route.ts)) stores orders **in memory** (resets on server restart) and returns an order id shown on the confirmation screen. A minimal **barista view** at [/barista](app/barista/page.tsx) lists orders and lets you mark them ready.
4. **Pickup capacity** — not solved here (same gap the handoff calls out). Slots are generated purely from the clock in [lib/pricing.ts](lib/pricing.ts).
5. **Notifications** — the "we'll text you" line is a demo promise; the order route just `console.log`s it.
6. **Payments** — out of scope. **PAY $X** simulates success and advances to confirmation.

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The barista queue is at `/barista`.

## Before this goes anywhere real

- Swap the in-memory order store ([lib/ordersStore.ts](lib/ordersStore.ts)) for SQLite or a hosted DB — it currently resets on every server restart/deploy.
- Add real per-slot capacity (`GET /api/slots`) before trusting the pickup-time picker under load.
- Wire actual SMS (Twilio) into the order route if the "we'll text you" promise needs to be real.
- Payments: this UI assumes Squarespace Commerce (or Square/Toast) owns checkout — don't stand up Stripe without deciding that first.

## Deploying to tb.adrianolm.com (Vercel)

1. Push this repo (or the `tinybarista/web` subfolder) to GitHub.
2. In Vercel, **New Project** → import it. If `web/` isn't the repo root, set **Root Directory** to `tinybarista/web` in the project's Build & Development settings.
3. Framework preset should auto-detect as Next.js — no env vars are required for the demo (no external services are called).
4. **Settings → Domains** → add `tb.adrianolm.com`. Vercel gives you a CNAME (or A/ALIAS) record to add wherever `adrianolm.com`'s DNS is managed — add it there and Vercel issues the certificate automatically.
5. The in-memory order store means orders won't survive a redeploy or serverless cold start under real traffic — fine for a click-through demo, worth flagging before a real launch (see above).
