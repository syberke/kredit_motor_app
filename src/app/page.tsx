import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  CheckCircle, 
  Shield, 
  Zap, 
  ArrowRight, 
  UserPlus, 
  FileText, 
  Truck,
  Star,
  MessageCircleQuestion
} from "lucide-react";

import Navbar from "@/components/ui/navbar"; 
import Footer from "@/components/ui/footer";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "Proses Instan",
      desc: "Pengajuan kredit online langsung diproses dalam hitungan menit tanpa ribet.",
    },
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      desc: "Data pribadi dan transaksi Anda dijamin keamanannya dengan enkripsi standar bank.",
    },
    {
      icon: CheckCircle,
      title: "Cicilan Fleksibel",
      desc: "Pilih tenor 12 hingga 60 bulan sesuai dengan kemampuan finansial Anda.",
    },
  ];

  const steps = [
    {
      icon: UserPlus,
      title: "1. Buat Akun",
      desc: "Daftar menggunakan email aktif Anda dalam waktu kurang dari 2 menit.",
    },
    {
      icon: Zap,
      title: "2. Cek Simulasi",
      desc: "Pilih harga motor dan atur tenor serta DP sesuai dengan budget Anda.",
    },
    {
      icon: FileText,
      title: "3. Upload Berkas",
      desc: "Lengkapi data diri dan unggah foto KTP untuk proses verifikasi instan.",
    },
    {
      icon: Truck,
      title: "4. Motor Dikirim",
      desc: "Setelah disetujui, bayar DP awal dan motor impian segera dikirim ke rumah.",
    },
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Wiraswasta",
      text: "Awalnya ragu ngajuin kredit online, tapi di sini prosesnya beneran transparan. Hari ini ngajuin, besoknya udah di-acc dan motor langsung dikirim. Mantap!",
    },
    {
      name: "Siti Aminah",
      role: "Karyawan Swasta",
      text: "Simulasinya sangat membantu. Saya bisa hitung-hitung dulu sebelum daftar. Cicilannya juga lebih ringan dibanding dealer langganan saya.",
    },
    {
      name: "Rizky Pratama",
      role: "Mahasiswa",
      text: "UI/UX website-nya enak banget dilihat, gampang dipake buat orang awam. Bayar cicilan bulanan juga praktis tinggal klik dari dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section id="beranda" className="relative pt-20 pb-32 px-4 sm:px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-orange-100/50 rounded-full blur-3xl -z-10"></div>
          
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-sm font-medium text-orange-600 shadow-sm">
              <Zap className="w-4 h-4" />
              <span>Platform Kredit Motor Online #1 di Indonesia</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-slate-900 leading-[1.1]">
              Wujudkan Motor Impian <br className="hidden sm:block" />
              <span className="text-[#f59e0b]">Tanpa Ribet.</span>
            </h1>

            <p className="text-slate-500 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed">
              Ajukan kredit motor baru atau bekas secara online. Dapatkan persetujuan instan, cicilan ringan, dan transparansi penuh tanpa biaya tersembunyi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-2xl h-14 px-8 text-base font-semibold shadow-lg shadow-orange-500/25" asChild>
                <Link href="/auth">
                  Ajukan Sekarang <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl h-14 px-8 text-base font-semibold border-slate-300 text-slate-700 hover:bg-slate-100" asChild>
                <Link href="/dashboard">Cek Simulasi Cicilan</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="keunggulan" className="py-24 bg-white px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">Kenapa Memilih Kami?</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Kami memberikan pengalaman pengajuan kredit kendaraan yang jauh lebih modern dan transparan dibanding cara tradisional.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-[#f59e0b]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="cara-kerja" className="py-24 bg-slate-50 px-4 sm:px-6 border-y border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">Langkah Mudah Pengajuan</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Hanya butuh 4 langkah sederhana dari ponsel Anda hingga motor idaman tiba di garasi rumah.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="relative text-center">
                    {/* Garis penghubung (hanya di desktop) */}
                    {i !== steps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-slate-200 border-dashed border-t-2 border-slate-300 z-0"></div>
                    )}
                    
                    <div className="relative z-10 w-16 h-16 rounded-full bg-white shadow-sm border border-[#f59e0b]/30 flex items-center justify-center mx-auto mb-6 text-[#f59e0b]">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed px-2">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section id="testimoni" className="py-24 bg-white px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">Apa Kata Mereka?</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Ribuan pelanggan telah membuktikan kemudahan kredit motor di platform kami.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-3xl p-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-8 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-lg">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{t.name}</h4>
                      <p className="text-sm text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION (Simple Static) */}
        <section className="py-24 bg-slate-50 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <MessageCircleQuestion className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">Pertanyaan Umum</h2>
            </div>

            <div className="space-y-4">
              {/* FAQ Item 1 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Apa saja syarat pengajuan kredit?</h3>
                <p className="text-slate-500">Anda hanya perlu menyiapkan e-KTP asli, berstatus WNI minimal usia 21 tahun (atau sudah menikah), dan memiliki penghasilan tetap.</p>
              </div>
              {/* FAQ Item 2 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Berapa lama proses persetujuannya?</h3>
                <p className="text-slate-500">Jika dokumen lengkap dan sesuai, proses verifikasi data hingga persetujuan biasanya memakan waktu maksimal 1x24 jam hari kerja.</p>
              </div>
              {/* FAQ Item 3 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Apakah ada biaya tambahan (Admin/Provisi)?</h3>
                <p className="text-slate-500">Semua biaya admin dan asuransi sudah diakumulasikan secara transparan di dalam simulasi kredit Anda. Tidak ada biaya sembunyi.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6 relative z-10">
              Siap Membawa Pulang Motor Anda?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg relative z-10">
              Bergabunglah dengan ribuan pelanggan yang telah berhasil mewujudkan kendaraan impian mereka bersama kami.
            </p>
            <Button size="lg" className="bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-2xl h-14 px-10 text-base font-semibold relative z-10" asChild>
              <Link href="/auth">Buat Akun Gratis</Link>
            </Button>
          </div>
        </section>

      </main>

      <Footer />

    </div>
  );
}