import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/lib/email";

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

    console.log("📩 Webhook masuk:", body);

    // 🔐 VALIDASI SIGNATURE
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;

    const hash = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hash !== signature_key) {
      console.error("❌ Invalid signature");
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 403 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 🔥 LANGSUNG PAKAI midtrans_order_id
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
      console.log("⚠️ Status diabaikan:", transaction_status);
      return NextResponse.json({ message: "Ignored" });
    }

    // 🔥 UPDATE BERDASARKAN midtrans_order_id
    const { data: payment, error } = await supabase
      .from("payments")
      .update({
        status: newStatus,
        paid_at: newStatus === "paid" ? new Date().toISOString() : null,
      })
      .eq("midtrans_order_id", order_id) // 🔥 FIX UTAMA
      .select()
      .single();

    if (error || !payment) {
      console.error("❌ Payment tidak ditemukan:", error);
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    console.log("✅ Payment updated:", payment);

    // 📧 EMAIL
    if (newStatus === "paid") {
      const { data: application } = await supabase
        .from("credit_applications")
        .select("user_id")
        .eq("id", payment.application_id)
        .single();

      if (application) {
        const { data: userRes } =
          await supabase.auth.admin.getUserById(application.user_id);

        const email = userRes?.user?.email;

        if (email) {
          await resend.emails.send({
            from: "Kredit Motor <onboarding@resend.dev>",
            to: email,
            subject: "Pembayaran Berhasil ✅",
            html: `
              <h2>Pembayaran Berhasil</h2>
              <p>Cicilan ke-${payment.installment_number} sudah dibayar</p>
              <p>Rp ${Number(payment.amount).toLocaleString("id-ID")}</p>
            `,
          });
        }
      }
    }

    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error("🔥 Webhook error:", err);
    return NextResponse.json(
      { message: "Internal error" },
      { status: 500 }
    );
  }
}