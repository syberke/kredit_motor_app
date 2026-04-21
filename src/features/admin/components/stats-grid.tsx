"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analytics.service";

export default function StatsGrid() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalLoan: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetch = async () => {
      const { payments, applications } = await getAnalytics();

      const totalRevenue = payments
        .filter((p) => p.status === "paid")
        .reduce((acc, p) => acc + p.amount, 0);

      const totalLoan = applications.reduce(
        (acc, a) => acc + a.price,
        0
      );

      setStats({
        totalRevenue,
        totalLoan,
        totalUsers: applications.length,
      });
    };

    fetch();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card title="Total Revenue" value={stats.totalRevenue} />
      <Card title="Total Loan" value={stats.totalLoan} />
      <Card title="Total Users" value={stats.totalUsers} />
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="p-4 bg-white shadow rounded">
      <p className="text-sm">{title}</p>
      <p className="text-xl font-bold">
        Rp {value.toLocaleString("id-ID")}
      </p>
    </div>
  );
}