"use client";

import { useCartTotals, useStore } from "@/lib/store";
import styles from "./FloatingBean.module.css";

export default function FloatingBean() {
  const { view, sheetId, goCheckout } = useStore();
  const { count } = useCartTotals();

  const show = count > 0 && !sheetId && view !== "checkout" && view !== "done";
  if (!show) return null;

  return (
    <button className={styles.bean} onClick={goCheckout} aria-label="Go to checkout">
      <img src="/img/bean.png" alt="" className={styles.img} />
      <span className={styles.badge}>{count}</span>
    </button>
  );
}
