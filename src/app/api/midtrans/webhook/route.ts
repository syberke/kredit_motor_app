import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/lib/email";
export async function POST(req: Request) {
  const body = await req.json();

  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
  } = body;

  // 🔐 VALIDASI SIGNATURE
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;

  const hash = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  if (hash !== signature_key) {
    return NextResponse.json(
      { message: "Invalid signature" },
      { status: 403 }
    );
  }

 if (transaction_status === "settlement") {
  const supabase = createClient(...);

  const { data: payment } = await supabase
    .from("payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("order_id", order_id)
    .select()
    .single();

  // 🔥 ambil email user
  const { data: application } = await supabase
    .from("credit_applications")
    .select("user_id")
    .eq("id", payment.application_id)
    .single();

  const { data: user } = await supabase.auth.admin.getUserById(
    application.user_id
  );

  const email = user.user.email;

  // 🔥 kirim email
  await resend.emails.send({
    from: "Kredit Motor <onboarding@resend.dev>",
    to: email,
    subject: "Pembayaran Berhasil",
    html: `
      <h2>Pembayaran berhasil</h2>
      <p>Cicilan ke-${payment.installment_number} sudah dibayar.</p>
      <p>Terima kasih!</p>
    `,
  });
}

  return NextResponse.json({ message: "OK" });
}