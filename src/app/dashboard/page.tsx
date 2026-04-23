import { createServerSupabase } from "@/lib/supabase-server";
import LogoutButton from "@/features/auth/components/logout-button";
import SimulationForm from "@/features/credit/components/simulation-form";
import ApplicationList from "@/features/credit/components/application-list";
import { Bike, User } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="size-5 text-primary" />
            <span className="font-semibold">Kredit Motor Online</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="size-4" />
              <span>{user?.email}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* Simulasi Kredit */}
        <section>
          <h2 className="text-xl font-bold mb-4">Simulasi Cicilan Motor</h2>
          <SimulationForm />
        </section>

        {/* Riwayat Pengajuan */}
        <section>
          <h2 className="text-xl font-bold mb-4">Riwayat Pengajuan Kredit</h2>
          <ApplicationList />
        </section>
      </main>
    </div>
  );
}