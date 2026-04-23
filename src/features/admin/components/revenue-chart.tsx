"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analytics.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  month: string;
  total: number;
};

export default function RevenueChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { payments } = await getAnalytics();

        const grouped: Record<string, number> = {};

        payments
          .filter((p: { status: string }) => p.status === "paid")
          .forEach((p: { paid_at: string; amount: number }) => {
            if (!p.paid_at) return;
            const month = new Date(p.paid_at).toISOString().slice(0, 7);
            grouped[month] = (grouped[month] || 0) + p.amount;
          });

        const chartData = Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, total]) => ({ month, total }));

        setData(chartData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="h-64 rounded-xl bg-muted animate-pulse" />;
  }

  if (data.length === 0) {
    return (
      <div className="h-40 border rounded-xl flex items-center justify-center text-sm text-muted-foreground">
        Belum ada data pembayaran.
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-4">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) =>
              `Rp ${(v / 1000000).toFixed(0)}jt`
            }
          />
       <Tooltip
  formatter={(value: unknown) => {
    if (typeof value !== "number") return "-";
    return `Rp ${value.toLocaleString("id-ID")}`;
  }}
/>
          <Line
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}