"use server";

import midtransClient from "midtrans-client";

export async function createTransaction(
    orderId: string,
    amount: number
) {
    const snap = new midtransClient.Snap({
        isProduction: false, // 🔥 sandbox
        serverKey: process.env.MIDTRANS_SERVER_KEY!,
    });

    const parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: amount,
        },
    };

    const transaction = await snap.createTransaction(parameter);

    return transaction.token;
}