"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analytics.service";
import { TrendingUp, CreditCard, Users } from "lucide-react";

type Stats = {
  totalRevenue: number;
  totalLoan: number;
  totalUsers: number;
};

export default function StatsGrid() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalLoan: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { payments, applications } = await getAnalytics();

        const totalRevenue = payments
          .filter((p: { status: string }) => p.status === "paid")
          .reduce((acc: number, p: { amount: number }) => acc + p.amount, 0);

        const totalLoan = applications.reduce(
          (acc: number, a: { price: number }) => acc + a.price,
          0
        );

        setStats({
          totalRevenue,
          totalLoan,
          totalUsers: applications.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Pendapatan",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "Total Pinjaman",
      value: `Rp ${stats.totalLoan.toLocaleString("id-ID")}`,
      icon: CreditCard,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Total Pengajuan",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/20",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`rounded-xl border p-4 space-y-2 ${card.bg}`}
          >
            <div className="flex items-center gap-2">
              <Icon className={`size-4 ${card.color}`} />
              <p className="text-sm text-muted-foreground">{card.title}</p>
            </div>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}