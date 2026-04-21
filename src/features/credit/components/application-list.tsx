"use client";

import { useEffect, useState } from "react";
import { getUserApplications } from "../services/credit.service";
import StatusBadge from "./status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { CreditApplication } from "../types/credit";
export default function ApplicationList() {


const [data, setData] = useState<CreditApplication[]>([]);

  useEffect(() => {
    getUserApplications().then(setData);
  }, []);

  if (data.length === 0) return <p>Belum ada pengajuan</p>;

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between">
              <p>Rp {item.price.toLocaleString("id-ID")}</p>
              <StatusBadge status={item.status} />
            </div>

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