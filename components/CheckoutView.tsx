"use client";

import { useMemo } from "react";
import { ASAP_LABEL, PREP_MIN, fmtTime, resolvePickup } from "@/lib/hours";
import { money, optSummary } from "@/lib/pricing";
import { useCartTotals, useStore } from "@/lib/store";
import styles from "./CheckoutView.module.css";

const TIP_OPTIONS: (0 | 0.12 | 0.18 | 0.22)[] = [0, 0.12, 0.18, 0.22];

export default function CheckoutView() {
  const {
    now,
    pickupDay,
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
    pickDay,
    pickSlot,
    pickTip,
    pickCustomTip,
    setCustomTip,
    setCustomUnit,
    placeOrder,
  } = useStore();
  const { lines, subtotal, count, tax, tip, total } = useCartTotals();

  const pickup = useMemo(() => resolvePickup(now, pickupDay, slot), [now, pickupDay, slot]);
  const { day } = pickup;

  let pickupNote = "";
  if (!pickup.openToday) pickupNote = "We're closed right now — pick from our next open days.";
  else if (day.isToday && pickup.times[0] === ASAP_LABEL)
    pickupNote = `Ready in about ${PREP_MIN} minutes, or pick any time through ${fmtTime(day.close)}.`;
  else if (day.isToday) pickupNote = `We open at ${fmtTime(day.open)} — pick any time below.`;

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={backToMenu}>
        ← Back to menu
      </button>
      <div className={styles.title}>Checkout</div>

      <div className={styles.stack}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Pickup time</div>
          <div className={`${styles.days} hscroll`}>
            {pickup.days.map((d) => (
              <button
                key={d.key}
                className={d.key === day.key ? styles.dayChipActive : styles.dayChip}
                onClick={() => pickDay(d.key)}
                aria-pressed={d.key === day.key}
              >
                <span className={styles.dayTop}>{d.relative}</span>
                <span className={styles.dayBottom}>{d.date}</span>
              </button>
            ))}
          </div>
          <div className={styles.dayMeta}>
            {day.long} · open {fmtTime(day.open)} – {fmtTime(day.close)}
          </div>
          <div className={styles.slotsScroll}>
            <div className={styles.slots}>
              {pickup.times.map((t) => (
                <button
                  key={t}
                  className={`${t === pickup.slot ? styles.slotChipActive : styles.slotChip} ${
                    t === ASAP_LABEL ? styles.slotWide : ""
                  }`}
                  onClick={() => pickSlot(t)}
                  aria-pressed={t === pickup.slot}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.slotNote}>
            {pickupNote} We&rsquo;ll text you when it&rsquo;s on the counter.
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
                      <button
                        className={styles.removeBtn}
                        onClick={() => lineRemove(index)}
                        aria-label="Remove drink"
                      >
                        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" aria-hidden="true">
                          <path
                            d="M1.5 4H13.5M5.5 4V2.5C5.5 2.22386 5.72386 2 6 2H9C9.27614 2 9.5 2.22386 9.5 2.5V4M6.5 7.5V11.5M8.5 7.5V11.5M2.5 4L3.2 13.2C3.24 13.65 3.62 14 4.07 14H10.93C11.38 14 11.76 13.65 11.8 13.2L12.5 4"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
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
