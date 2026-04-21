"use client";

import { useEffect, useState } from "react";
import { getUserApplications } from "../services/credit.service";
import { CreditApplication } from "../types/credit";
import StatusBadge from "./status-badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ApplicationList() {
  const [data, setData] = useState<CreditApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUserApplications();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (data.length === 0) return <p>Belum ada pengajuan</p>;

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between">
              <p className="font-medium">
                Rp {item.price.toLocaleString("id-ID")}
              </p>
              <StatusBadge status={item.status} />
            </div>

            <p>DP: Rp {item.dp.toLocaleString("id-ID")}</p>
            <p>Tenor: {item.tenor} bulan</p>
            <p>
              Cicilan: Rp {item.installment.toLocaleString("id-ID")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getPayments } from "../services/payment.service";

export default function PaymentList({ appId }: { appId: string }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getPayments(appId).then(setData);
  }, [appId]);

  return (
    <div>
      {data.map((p) => (
        <div key={p.id} className="border p-2 mb-2">
          <p>Cicilan ke-{p.installment_number}</p>
          <p>Rp {p.amount}</p>
          <p>Jatuh tempo: {p.due_date}</p>
          <p>Status: {p.status}</p>
        </div>
      ))}
    </div>
  );
}


/features/

payment/components/application-list.tsx
payment/services/payment.sercive.ts.tsx
payment/types/payment.ts
creadit/components/aplication-list.tsx
admin/component/action-buttons.tsx
admin/component/admin-list.tsx

/app/

actions/admin.ts
actions/PaymentList.ts
