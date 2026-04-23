"use server";

import midtransClient from "midtrans-client";
import { createServerSupabase } from "@/lib/supabase-server";

export async function createTransaction(
  paymentId: string,
  amount: number
) {
  const supabase = await createServerSupabase();

  const orderId = `${paymentId}-${Date.now()}`; // 🔥 unik

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
  });

const parameter = {
  transaction_details: {
    order_id: orderId,
    gross_amount: Math.round(amount), // ✔ fix
  },
};

  const transaction = await snap.createTransaction(parameter);

  // 🔥 simpan order_id ke DB
  await supabase
    .from("payments")
    .update({ midtrans_order_id: orderId })
    .eq("id", paymentId);

  return transaction.token;
}