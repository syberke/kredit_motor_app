"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function generatePayments(
  applicationId: string,
  installment: number,
  tenor: number
) {
  const today = new Date();

  const payments = Array.from({ length: tenor }, (_, i) => {
    const dueDate = new Date(today);
    dueDate.setMonth(today.getMonth() + (i + 1));

    return {
      application_id: applicationId,
      installment_number: i + 1,
      amount: Math.round(installment),
      due_date: dueDate.toISOString().split("T")[0],
      status: "unpaid",
    };
  });

  const { data, error } = await supabase
    .from("payments")
    .insert(payments)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function markAsPaid(id: string) {
  const { error } = await supabase
    .from("payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

// ✅ BARU: Update by payment ID langsung (dipanggil dari onSuccess snap)
export async function markAsPaidById(paymentId: string) {
  const { error } = await supabase
    .from("payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", paymentId);

  if (error) throw new Error(error.message);
}