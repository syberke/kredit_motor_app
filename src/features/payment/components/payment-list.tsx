"use client";

import { useEffect, useState } from "react";
import { getPayments } from "../services/payment.service";
import { Payment } from "../types/payment";
import PayButton from "./pay-button";
export default function PaymentList({ appId }: { appId: string }) {
  const [data, setData] = useState<Payment[]>([]);

  useEffect(() => {
    getPayments(appId).then(setData);
  }, [appId]);

  if (data.length === 0) return <p>Belum ada cicilan</p>;

  return (
    <div className="space-y-2">
      {data.map((p) => (
        <div key={p.id} className="border p-3 rounded">
          <p>Cicilan ke-{p.installment_number}</p>
          <p>Rp {p.amount.toLocaleString("id-ID")}</p>
          <p>Jatuh tempo: {p.due_date}</p>
          <p>Status: {p.status}</p>
          {p.status === "unpaid" && (
  <PayButton
    paymentId={p.id}
    amount={p.amount}
  />
)}
        </div>
        
      ))}
    </div>
  );
}