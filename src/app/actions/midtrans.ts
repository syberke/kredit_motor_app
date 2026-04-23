"use server";

import midtransClient from "midtrans-client";
import { createClient } from "@supabase/supabase-js";

export async function createTransaction(
  paymentId: string,
  amount: number
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const orderId = `${paymentId}-${Date.now()}`;

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
  });

  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: orderId,
      gross_amount: Math.round(amount),
    },
  });

  const { data, error } = await supabase
    .from("payments")
    .update({
      midtrans_order_id: orderId,
    })
    .eq("id", paymentId)
    .select();

  console.log("UPDATE RESULT:", data, error);

  if (error || !data || data.length === 0) {
    throw new Error("Gagal update payment");
  }

  return transaction.token;
}