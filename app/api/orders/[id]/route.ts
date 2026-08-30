import { NextRequest, NextResponse } from "next/server";
import { markReady } from "@/lib/ordersStore";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const order = markReady(id);
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ order });
}
