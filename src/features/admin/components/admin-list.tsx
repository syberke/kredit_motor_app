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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    const res = await getAllApplications();
    setData(res);
  };

  if (loading)
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );

  if (data.length === 0)
    return (
      <div className="text-center py-8 text-muted-foreground text-sm border rounded-xl">
        Belum ada pengajuan kredit.
      </div>
    );

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>

            {/* Detail */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">DP</p>
                <p>Rp {item.dp.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Tenor</p>
                <p>{item.tenor} bulan</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Cicilan/bln</p>
                <p>Rp {item.installment.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Bunga</p>
                <p>{item.interest}%/thn</p>
              </div>
            </div>

            {/* Actions */}
            {item.status === "pending" && (
              <ActionButtons id={item.id} onSuccess={handleRefresh} />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}