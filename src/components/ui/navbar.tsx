import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bike, User } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function Navbar() {
  // Panggil Supabase untuk mengecek sesi user saat ini
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 bg-white/80 border-b border-slate-200/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#f59e0b] flex items-center justify-center text-white shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Bike className="w-6 h-6" />
          </div>
          <span className="font-serif font-bold text-xl text-slate-900">
            Kredit Motor
          </span>
        </Link>

        {/* Menu Navigasi */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
          <Link href="/#beranda" className="hover:text-[#f59e0b] transition-colors">Beranda</Link>
          <Link href="/#keunggulan" className="hover:text-[#f59e0b] transition-colors">Keunggulan</Link>
          <Link href="/#cara-kerja" className="hover:text-[#f59e0b] transition-colors">Cara Kerja</Link>
          <Link href="/#testimoni" className="hover:text-[#f59e0b] transition-colors">Testimoni</Link>
        </nav>

        {/* Action Buttons (Login / Register / Account) */}
        <div className="flex items-center gap-3">
          {user ? (
            // JIKA SUDAH LOGIN: Tampilkan tombol "Akun Saya" yang mengarah ke Dashboard
            <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-xl shadow-sm font-semibold" asChild>
              <Link href="/dashboard">
                <User className="w-4 h-4 mr-2" />
                Akun Saya
              </Link>
            </Button>
          ) : (
            // JIKA BELUM LOGIN: Tampilkan tombol Masuk & Daftar
            <>
              <Button variant="ghost" className="hidden sm:inline-flex hover:bg-slate-100 rounded-xl font-semibold" asChild>
                <Link href="/auth">Masuk</Link>
              </Button>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm font-semibold" asChild>
                <Link href="/auth">Daftar Akun</Link>
              </Button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}