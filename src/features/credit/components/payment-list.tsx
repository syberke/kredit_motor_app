"use client";

import { useEffect, useState } from "react";
import { getPayments, Payment } from "../services/payment.service";
import { Button } from "@/components/ui/button";
import { generateInvoice } from "../services/invoice.service";
import { createTransaction } from "@/app/actions/midtrans";
export default function PaymentList({ appId }: { appId: string }) {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPayments(appId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appId]);

  // 🔥 DOWNLOAD INVOICE
  const handleDownload = async (payment: Payment) => {
    try {
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
    } catch (err) {
      console.error(err);
      alert("Gagal download invoice");
    }
  };

const handlePay = async (payment: Payment) => {
  const token = await createTransaction(
    payment.id,
    payment.amount
  );


  window.snap.pay(token, {
    onSuccess: () => {
      alert("Pembayaran berhasil!");
      location.reload(); // refresh data
    },
    onPending: () => {
      alert("Menunggu pembayaran...");
    },
    onError: () => {
      alert("Pembayaran gagal");
    },
  });
};

  if (loading) return <p>Memuat cicilan...</p>;

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada angsuran.</p>;
  }

  return (
    <div className="space-y-3">
      {data.map((p) => (
        <div
          key={p.id}
          className="border rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">
              Cicilan ke-{p.installment_number}
            </p>
            <p className="text-sm text-muted-foreground">
              Rp {p.amount.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-muted-foreground">
              Jatuh tempo: {p.due_date}
            </p>
          </div>

          {p.status === "unpaid" ? (
            <Button onClick={() => handlePay(p)}>
              Bayar Sekarang
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