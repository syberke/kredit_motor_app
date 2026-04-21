import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/lib/email";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const dateStr = tomorrow.toISOString().split("T")[0];

  // 🔥 ambil cicilan yang jatuh tempo besok
  const { data: payments, error } = await supabase
    .from("payments")
    .select("*")
    .eq("due_date", dateStr)
    .eq("status", "unpaid");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  for (const p of payments || []) {
    // 🔥 ambil user
    const { data: app } = await supabase
      .from("credit_applications")
      .select("user_id")
      .eq("id", p.application_id)
      .single();

    const { data: user } = await supabase.auth.admin.getUserById(
      app.user_id
    );

    const email = user.user.email;

    // 🔥 kirim email
    await resend.emails.send({
      from: "Kredit Motor <onboarding@resend.dev>",
      to: email,
      subject: "Reminder Cicilan",
      html: `
        <h3>Reminder Pembayaran</h3>
        <p>Cicilan ke-${p.installment_number} jatuh tempo besok.</p>
        <p>Jumlah: Rp ${p.amount}</p>
      `,
    });
  }

  return NextResponse.json({ message: "Reminder sent" });
}