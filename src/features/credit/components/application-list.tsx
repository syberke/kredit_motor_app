"use client";

import { useEffect, useState } from "react";
import { getUserApplications } from "../services/credit.service";
import StatusBadge from "./status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditApplication } from "../types/credit";
import Link from "next/link";

export default function ApplicationList() {
  const [data, setData] = useState<CreditApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserApplications()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Memuat data...</p>;

  if (data.length === 0)
    return (
      <div className="text-center py-8 text-mut ed-foreground text-sm border rounded-xl">
        Belum ada pengajuan kredit. Gunakan form simulasi di atas untuk mengajukan.
      </div>
    );

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
                <div className="text-sm text-muted-foreground flex gap-4 flex-wrap">
                  <span>DP: Rp {item.dp.toLocaleString("id-ID")}</span>
                  <span>Tenor: {item.tenor} bln</span>
                  <span>
                    Cicilan: Rp {item.installment.toLocaleString("id-ID")}/bln
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              {item.status === "approved" && (
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/payment/${item.id}`}>
                    Bayar Cicilan
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}