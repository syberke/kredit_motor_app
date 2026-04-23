import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    console.log("📩 WEBHOOK:", body);

    if (!order_id) {
      return NextResponse.json({ error: "No order_id" }, { status: 400 });
    }

    // ✅ VALIDASI SIGNATURE
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const hash = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hash !== signature_key) {
      console.error("❌ Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let newStatus: "paid" | "pending" | "failed" | null = null;

    if (
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept")
    ) {
      newStatus = "paid";
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "expire" ||
      transaction_status === "deny"
    ) {
      newStatus = "failed";
    }

    if (!newStatus) {
      return NextResponse.json({ message: "ignored" });
    }

    // ✅ UPDATE (IDEMPOTENT)
    const { data, error } = await supabase
      .from("payments")
      .update({
        status: newStatus,
        paid_at: newStatus === "paid" ? new Date().toISOString() : null,
      })
      .eq("midtrans_order_id", order_id)
      .neq("status", "paid") // 🔥 biar gak overwrite
      .select()
      .single();

    if (error) {
      console.error("❌ Update gagal:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    console.log("✅ UPDATED:", data);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("🔥 Webhook error:", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}