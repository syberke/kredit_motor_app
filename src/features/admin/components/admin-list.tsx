"use client";

import { useEffect, useState } from "react";
import { getAllApplications } from "../services/admin.service";
import { CreditApplication } from "@/features/credit/types/credit";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/features/credit/components/status-badge";
import ActionButtons from "./action-buttons";

export default function AdminList() {
  const [data, setData] = useState<CreditApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllApplications();
        setData(res);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (data.length === 0) return <p>Tidak ada data</p>;

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between">
              <p>Rp {item.price.toLocaleString("id-ID")}</p>
              <StatusBadge status={item.status} />
            </div>

            <p>DP: Rp {item.dp.toLocaleString("id-ID")}</p>
            <p>Tenor: {item.tenor} bulan</p>
            <p>
              Cicilan: Rp {item.installment.toLocaleString("id-ID")}
            </p>

            <ActionButtons id={item.id} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}