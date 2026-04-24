import { createServerSupabase } from "@/lib/supabase-server";
import LogoutButton from "@/features/auth/components/logout-button";
import SimulationForm from "@/features/credit/components/simulation-form";
import ApplicationList from "@/features/credit/components/application-list";
import { Bike, User, LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Mengambil nama depan dari email untuk sapaan yang lebih ramah
  const userName = user?.email?.split('@')[0] || "Pengguna";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- HEADER / NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f59e0b] flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
              <Bike className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-lg text-slate-800 hidden sm:block">
              Kredit Motor
            </span>
          </div>
          
          {/* Info User & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-sm font-medium text-slate-600 border border-slate-200">
              <User className="w-4 h-4 text-slate-400" />
              <span>{user?.email}</span>
            </div>
            <LogoutButton />
          </div>

        </div>
      </header>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Banner Sapaan */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Halo, {userName}!
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Selamat datang di dashboard pengelolaan dan pengajuan kredit Anda.
          </p>
        </div>

        {/* Layout Grid (Desktop: Kiri-Kanan, Mobile: Atas-Bawah) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI: Form Simulasi (Mengambil porsi 5 dari 12 kolom) */}
          <section className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
            <SimulationForm />
          </section>

          {/* KOLOM KANAN: Riwayat Pengajuan (Mengambil porsi 7 dari 12 kolom) */}
          <section className="lg:col-span-7 xl:col-span-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              
              {/* Header List */}
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-[#f59e0b]" />
                  Riwayat Pengajuan
                </h2>
                <p className="text-sm text-slate-500 mt-1.5">
                  Pantau status persetujuan dan rincian angsuran motor Anda di sini.
                </p>
              </div>
              
              {/* Komponen List dari file terpisah */}
              <ApplicationList />
              
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}