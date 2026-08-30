import { NextRequest, NextResponse } from "next/server";
import { addOrder, listOrders } from "@/lib/ordersStore";

export async function GET() {
  return NextResponse.json({ orders: listOrders() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const order = addOrder({
    name: body.name || "",
    phone: body.phone || "",
    slot: body.slot || "",
    items: Array.isArray(body.items) ? body.items : [],
    total: typeof body.total === "number" ? body.total : 0,
  });
  // "We'll text you when it's on the counter" — demo just logs it (README §5).
  console.log(`[tb] order ${order.id} placed for ${order.name || "a guest"} · pickup ${order.slot}`);
  return NextResponse.json({ orderId: order.id, slot: order.slot, etaMinutes: 12 });
}
