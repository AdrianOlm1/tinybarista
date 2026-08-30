"use client";

import { useMemo } from "react";
import { money, buildSlots, optSummary } from "@/lib/pricing";
import { useCartTotals, useStore } from "@/lib/store";
import styles from "./CheckoutView.module.css";

const TIP_OPTIONS: (0 | 0.12 | 0.18 | 0.22)[] = [0, 0.12, 0.18, 0.22];

export default function CheckoutView() {
  const {
    now,
    slot,
    name,
    phone,
    tipPct,
    tipMode,
    customTip,
    customUnit,
    backToMenu,
    goMenu,
    openSheet,
    lineInc,
    lineDec,
    lineRemove,
    setName,
    setPhone,
    pickSlot,
    pickTip,
    pickCustomTip,
    setCustomTip,
    setCustomUnit,
    placeOrder,
  } = useStore();
  const { lines, subtotal, count, tax, tip, total } = useCartTotals();

  const slotInfo = useMemo(() => buildSlots(now), [now]);
  const activeSlot = slot && slotInfo.slots.includes(slot) ? slot : slotInfo.slots[0];

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={backToMenu}>
        ← Back to menu
      </button>
      <div className={styles.title}>Checkout</div>

      <div className={styles.stack}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Pickup time</div>
          <div className={styles.slots}>
            {slotInfo.slots.map((s) => (
              <button
                key={s}
                className={s === activeSlot ? styles.slotChipActive : styles.slotChip}
                onClick={() => pickSlot(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className={styles.slotNote}>
            {slotInfo.closed
              ? "We're closed right now — these are tomorrow's first windows."
              : "Times roll forward as the morning goes; last pickup is 1:30 PM."}{" "}
            We&rsquo;ll text you when it&rsquo;s on the counter.
          </div>
        </div>

        <div className={`${styles.card} ${styles.detailsGrid}`}>
          <div>
            <div className={styles.fieldLabel}>Name on the cup</div>
            <input
              className={styles.input}
              placeholder="Alexis"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <div className={styles.fieldLabel}>Phone for the text</div>
            <input
              className={styles.input}
              placeholder="(909) 555-0142"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.orderCard}>
          <div className={styles.orderHead}>
            <span className={styles.orderTitle}>Your order ♥</span>
            <span className={styles.orderCount}>{count === 1 ? "1 drink" : `${count} drinks`}</span>
          </div>
          {lines.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyBody}>Nothing here yet — go build something sweet.</div>
              <button className={styles.browseBtn} onClick={() => goMenu()}>
                Browse the menu
              </button>
            </div>
          ) : (
            <div className={styles.lines}>
              {lines.map(({ line, item, index, price }) => (
                <div className={styles.line} key={index}>
                  <img
                    src={item.img ? `/img/${item.img}` : "/img/logo.png"}
                    alt=""
                    className={styles.lineImg}
                  />
                  <div className={styles.lineBody}>
                    <div className={styles.lineTop}>
                      <span className={styles.lineName}>{item.name}</span>
                      <span className={styles.linePrice}>{money(price)}</span>
                    </div>
                    <div className={styles.lineOpts}>{optSummary(item, line.sel, line.note)}</div>
                    <div className={styles.lineActions}>
                      <div className={styles.stepper}>
                        <button className={styles.stepBtn} onClick={() => lineDec(index)}>
                          −
                        </button>
                        <span className={styles.stepVal}>{line.qty}</span>
                        <button className={styles.stepBtn} onClick={() => lineInc(index)}>
                          +
                        </button>
                      </div>
                      <button className={styles.editBtn} onClick={() => openSheet(line.id, index)}>
                        Edit drink
                      </button>
                      <button className={styles.removeBtn} onClick={() => lineRemove(index)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.tipHead}>
            <span className={styles.cardLabel} style={{ marginBottom: 0 }}>
              Tip your baristas
            </span>
            <span className={styles.tipNote}>100% goes to Vero &amp; Alexis ♥</span>
          </div>
          <div className={styles.tips}>
            {TIP_OPTIONS.map((p) => (
              <button
                key={p}
                className={tipMode === "pct" && p === tipPct ? styles.tipTileActive : styles.tipTile}
                onClick={() => pickTip(p)}
              >
                <span className={styles.tipLabel}>{p === 0 ? "No tip" : `${Math.round(p * 100)}%`}</span>
                <span className={styles.tipAmount}>{p === 0 ? "—" : money(subtotal * p)}</span>
              </button>
            ))}
            <button
              className={tipMode === "custom" ? styles.tipTileActive : styles.tipTile}
              onClick={pickCustomTip}
            >
              <span className={styles.tipLabel}>Custom</span>
              <span className={styles.tipAmount}>
                {tipMode === "custom" ? money(customUnit === "%" ? subtotal * (customTip / 100) : customTip) : "—"}
              </span>
            </button>
          </div>
          {tipMode === "custom" && (
            <div className={styles.customTipRow}>
              <span className={styles.customTipPrefix}>{customUnit}</span>
              <input
                className={styles.customTipInput}
                type="number"
                min="0"
                step={customUnit === "%" ? 1 : 0.5}
                inputMode="decimal"
                placeholder={customUnit === "%" ? "0" : "0.00"}
                value={customTip === 0 ? "" : customTip}
                onChange={(e) => setCustomTip(parseFloat(e.target.value) || 0)}
                autoFocus
              />
              <div className={styles.customUnitToggle}>
                <button
                  className={customUnit === "$" ? styles.customUnitBtnActive : styles.customUnitBtn}
                  onClick={() => setCustomUnit("$")}
                  aria-label="Dollars"
                >
                  $
                </button>
                <button
                  className={customUnit === "%" ? styles.customUnitBtnActive : styles.customUnitBtn}
                  onClick={() => setCustomUnit("%")}
                  aria-label="Percent"
                >
                  %
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Tax</span>
            <span>{money(tax)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Tip</span>
            <span>{money(tip)}</span>
          </div>
          <div className={styles.totalFinal}>
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>

        <button className={styles.payBtn} disabled={lines.length === 0} onClick={placeOrder}>
          Pay {money(total)}
        </button>
        <div className={styles.payNote}>Card, Apple Pay, or Google Pay — handled by your existing checkout.</div>
      </div>
    </div>
  );
}
