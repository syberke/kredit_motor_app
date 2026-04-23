"use client";

import { useEffect, useState } from "react";
import { getPayments, Payment } from "../services/payment.service";
import { Button } from "@/components/ui/button";
import { generateInvoice } from "../services/invoice.service";
import { createTransaction } from "@/app/actions/midtrans";

export default function PaymentList({ appId }: { appId: string }) {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    getPayments(appId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appId]);

  // DOWNLOAD INVOICE
  const handleDownload = async (payment: Payment) => {
    const pdfBytes = await generateInvoice({
      id: payment.id,
      amount: payment.amount,
      installment_number: payment.installment_number,
      paid_at: payment.paid_at ?? new Date().toISOString(),
    });

    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  // PAY
  const handlePay = async (payment: Payment) => {
    try {
      setPayingId(payment.id);

      const token = await createTransaction(
        payment.id,
        Math.round(payment.amount)
      );

    
      window.snap.pay(token, {
        onSuccess: () => {
          alert("Pembayaran berhasil!");
          location.reload();
        },
        onPending: () => {
          alert("Menunggu pembayaran...");
        },
        onError: () => {
          alert("Pembayaran gagal");
        },
      });
    } finally {
      setPayingId(null);
    }
  };

  if (loading) return <p>Memuat cicilan...</p>;

  return (
    <div className="space-y-3">
      {data.map((p) => (
        <div
          key={p.id}
          className="border rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">Cicilan ke-{p.installment_number}</p>
            <p className="text-sm text-muted-foreground">
              Rp {p.amount.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-muted-foreground">
              Status:{" "}
              <span
                className={
                  p.status === "paid"
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                {p.status}
              </span>
            </p>
          </div>

          {p.status === "unpaid" ? (
            <Button
              disabled={payingId === p.id}
              onClick={() => handlePay(p)}
            >
              {payingId === p.id ? "Memproses..." : "Bayar"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => handleDownload(p)}
            >
              Invoice
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}