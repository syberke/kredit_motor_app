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

  const orderId = `INV-${paymentId}-${Date.now()}`;

  // ✅ 1. simpan dulu ke DB (ANTI RACE CONDITION)
  const { error: updateError } = await supabase
    .from("payments")
    .update({
      midtrans_order_id: orderId,
      status: "pending",
    })
    .eq("id", paymentId);

  if (updateError) {
    throw new Error("Gagal update order_id");
  }

  // ✅ 2. create midtrans transaction
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

  // ✅ optional: simpan token
  await supabase
    .from("payments")
    .update({
      snap_token: transaction.token,
    })
    .eq("id", paymentId);

  return transaction.token;
}