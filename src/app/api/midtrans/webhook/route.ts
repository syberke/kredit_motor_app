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

    // 🔗 KONEK SUPABASE (SERVICE ROLE)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 🔥 AMBIL ID ASLI DARI ORDER_ID
    const paymentId = order_id.split("-")[0];

    console.log("🆔 Payment ID:", paymentId);

    // 🎯 HANDLE STATUS
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
      console.log("⚠️ Status tidak diproses:", transaction_status);
      return NextResponse.json({ message: "Ignored" });
    }

    // 🗄️ UPDATE PAYMENT
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .update({
        status: newStatus,
        paid_at: newStatus === "paid" ? new Date().toISOString() : null,
      })
      .eq("id", paymentId) // 🔥 FIX UTAMA
      .select()
      .single();

    if (paymentError || !payment) {
      console.error("❌ Payment tidak ditemukan:", paymentError);
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    console.log("✅ Payment updated:", payment);

    // 📧 KIRIM EMAIL JIKA BERHASIL
    if (newStatus === "paid") {
      const { data: application } = await supabase
        .from("credit_applications")
        .select("user_id")
        .eq("id", payment.application_id)
        .single();

      if (application) {
        const { data: userResponse } =
          await supabase.auth.admin.getUserById(application.user_id);

        const email = userResponse?.user?.email;

        if (email) {
          await resend.emails.send({
            from: "Kredit Motor <onboarding@resend.dev>",
            to: email,
            subject: "Pembayaran Berhasil ✅",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">Pembayaran Berhasil!</h2>
                <p>Cicilan ke-<strong>${payment.installment_number}</strong> berhasil dibayar.</p>
                <p>Jumlah: <strong>Rp ${Number(
                  payment.amount
                ).toLocaleString("id-ID")}</strong></p>
                <p>Terima kasih telah menggunakan Kredit Motor Online.</p>
                <hr />
                <p style="color: #6b7280; font-size: 12px;">
                  Email ini dikirim otomatis.
                </p>
              </div>
            `,
          });

          console.log("📧 Email terkirim ke:", email);
        }
      }
    }

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("🔥 Webhook error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}