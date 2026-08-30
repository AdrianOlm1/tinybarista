import type { OrderRecord } from "./types";

// In-memory "fake it" order store for the demo (README §3). Resets on server
// restart — swap for SQLite or a JSON file before this goes anywhere real.
const orders: OrderRecord[] = [];

export function addOrder(order: Omit<OrderRecord, "id" | "status" | "createdAt">): OrderRecord {
  const record: OrderRecord = {
    ...order,
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    status: "placed",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(record);
  return record;
}

export function listOrders(): OrderRecord[] {
  return orders;
}

export function markReady(id: string): OrderRecord | null {
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = "ready";
  return order;
}
