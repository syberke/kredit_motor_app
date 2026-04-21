"use client";

import { createTransaction } from "@/app/actions/midtrans";

export default function PayButton({
  paymentId,
  amount,
}: {
  paymentId: string;
  amount: number;
}) {
  const handlePay = async () => {
    const token = await createTransaction(paymentId, amount);

   
    window.snap.pay(token, {
      onSuccess: function () {
        alert("Pembayaran berhasil!");
      },
      onPending: function () {
        alert("Menunggu pembayaran...");
      },
      onError: function () {
        alert("Pembayaran gagal");
      },
    });
  };

  return (
    <button
      onClick={handlePay}
      className="bg-blue-500 text-white px-3 py-1 rounded"
    >
      Bayar
    </button>
  );
}