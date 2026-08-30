"use client";

import { useCallback, useEffect, useState } from "react";
import type { OrderRecord } from "@/lib/types";
import styles from "./barista.module.css";

export default function BaristaPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const refresh = useCallback(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data: { orders: OrderRecord[] }) => setOrders(data.orders))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 15000);
    return () => clearInterval(id);
  }, [refresh]);

  const markReady = (id: string) => {
    fetch(`/api/orders/${id}`, { method: "PATCH" }).then(refresh);
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Barista view</h1>
      <p className={styles.sub}>Demo-only order queue — polls every 15s. Not part of the customer site.</p>
      {orders.length === 0 ? (
        <p className={styles.empty}>No orders yet.</p>
      ) : (
        <div className={styles.list}>
          {orders.map((o) => (
            <div key={o.id} className={o.status === "ready" ? styles.cardReady : styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.orderId}>#{o.id}</span>
                <span className={styles.status}>{o.status}</span>
              </div>
              <div className={styles.name}>{o.name || "Guest"} · {o.slot}</div>
              <ul className={styles.items}>
                {o.items.map((it, i) => (
                  <li key={i}>
                    {it.qty}× {it.name} — {it.opts}
                  </li>
                ))}
              </ul>
              <div className={styles.foot}>
                <span>${o.total.toFixed(2)}</span>
                {o.status !== "ready" && (
                  <button className={styles.btn} onClick={() => markReady(o.id)}>
                    Mark ready
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
