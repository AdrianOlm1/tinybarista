"use client";

import { useStore } from "@/lib/store";
import styles from "./DoneView.module.css";

export default function DoneView() {
  const { name, slot, lastOrderId, backToMenu } = useStore();

  return (
    <div className={styles.wrap}>
      <div className={styles.script}>¡Gracias!</div>
      <div className={styles.line}>
        Order for {name || "the counter"} · pickup {slot}
      </div>
      {lastOrderId && <div className={styles.orderId}>Order #{lastOrderId}</div>}
      <div className={styles.body}>
        We&rsquo;ll text you when it&rsquo;s on the counter. 34541 Yucaipa Blvd — see you soon. ♥
      </div>
      <button className={styles.btn} onClick={backToMenu}>
        Order something else
      </button>
    </div>
  );
}
