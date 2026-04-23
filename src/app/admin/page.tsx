import AdminList from "@/features/admin/components/admin-list";
import StatsGrid from "@/features/admin/components/stats-grid";
import RevenueChart from "@/features/admin/components/revenue-chart";
import { BarChart3, Bike } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import LogoutButton from "@/features/auth/components/logout-button";

export default async function AdminPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="size-5 text-primary" />
            <span className="font-semibold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="size-4" />
            Ringkasan
          </h2>
          <StatsGrid />
        </section>

        {/* Chart */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Grafik Pendapatan</h2>
          <RevenueChart />
        </section>

        {/* Daftar Pengajuan */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Semua Pengajuan Kredit</h2>
          <AdminList />
        </section>
      </main>
    </div>
  );
}