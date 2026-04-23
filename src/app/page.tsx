import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bike, CheckCircle, Shield, Zap } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "Proses Cepat",
      desc: "Pengajuan kredit online dalam hitungan menit",
    },
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      desc: "Data Anda dijamin keamanannya",
    },
    {
      icon: CheckCircle,
      title: "Cicilan Fleksibel",
      desc: "Tenor 12-60 bulan sesuai kemampuan Anda",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
          <Bike className="size-4" />
          <span>Platform Kredit Motor Online #1</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl">
          Kredit Motor
          <span className="text-primary"> Mudah & Cepat</span>
        </h1>

        <p className="text-muted-foreground max-w-md text-lg">
          Ajukan kredit motor impian Anda secara online. Proses transparan,
          cicilan terjangkau, dan persetujuan cepat.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <Button size="lg" asChild>
            <Link href="/auth">Mulai Sekarang</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth">Masuk ke Akun</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="border rounded-xl p-6 space-y-3 text-center"
              >
                <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 mx-auto">
                  <Icon className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}