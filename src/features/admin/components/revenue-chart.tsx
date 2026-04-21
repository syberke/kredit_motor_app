"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analytics.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function RevenueChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { payments } = await getAnalytics();

      const grouped: Record<string, number> = {};

      payments
        .filter((p) => p.status === "paid")
        .forEach((p) => {
          const month = new Date(p.paid_at)
            .toISOString()
            .slice(0, 7);

          grouped[month] = (grouped[month] || 0) + p.amount;
        });

      const chartData = Object.entries(grouped).map(
        ([month, total]) => ({
          month,
          total,
        })
      );

      setData(chartData);
    };

    fetch();
  }, []);

  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="total" />
    </LineChart>
  );
}