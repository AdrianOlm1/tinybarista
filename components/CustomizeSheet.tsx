"use client";

import { findItem } from "@/lib/menu";
import { money, optPrice } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import styles from "./CustomizeSheet.module.css";

export default function CustomizeSheet() {
  const { sheetId, sel, qty, note, closeSheet, pickChoice, setNote, qtyUp, qtyDown, addToCart } = useStore();
  if (!sheetId) return null;
  const item = findItem(sheetId);
  if (!item) return null;

  const price = optPrice(item, sel) * qty;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={closeSheet} />
      <div className={styles.sheet}>
        <div className={styles.head}>
          <img
            src={item.img ? `/img/${item.img}` : "/img/logo.png"}
            alt=""
            className={styles.headImg}
          />
          <div className={styles.headText}>
            <div className={styles.headName}>{item.name}</div>
            <div className={styles.headBlurb}>{item.blurb}</div>
            <div className={styles.headTag}>Build it your way ♥</div>
          </div>
          <button className={styles.closeBtn} onClick={closeSheet} aria-label="Close">
            ×
          </button>
        </div>

        <div className={styles.body}>
          {item.opts.map(([label, choices, hint]) => (
            <div key={label}>
              <div className={styles.groupLabelRow}>
                <span className={styles.groupLabel}>{label}</span>
                {hint && <span className={styles.groupHint}>{hint}</span>}
              </div>
              <div className={styles.choices}>
                {choices.map((c, idx) => {
                  const active = (sel[label] ?? 0) === idx;
                  const extra = c[1] === "+0" ? "" : `+$${c[1].replace("+", "")}`;
                  return (
                    <button
                      key={c[0]}
                      className={active ? styles.choiceActive : styles.choice}
                      onClick={() => pickChoice(label, idx)}
                    >
                      <span>{c[0]}</span>
                      {extra && <span className={styles.choiceExtra}>{extra}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div>
            <div className={styles.noteLabel}>Notes for the barista</div>
            <input
              className={styles.noteInput}
              placeholder="light ice, extra crumbs…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.foot}>
          <div className={styles.stepper}>
            <button className={styles.stepBtn} onClick={qtyDown}>
              −
            </button>
            <span className={styles.stepVal}>{qty}</span>
            <button className={styles.stepBtn} onClick={qtyUp}>
              +
            </button>
          </div>
          <button className={styles.addBtn} onClick={addToCart}>
            <span>Add to cart</span>
            <span>{money(price)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
