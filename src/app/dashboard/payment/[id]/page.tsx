import { createServerSupabase } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import PaymentList from "@/features/payment/components/payment-list";
import StatusBadge from "@/features/credit/components/status-badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PaymentPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: application, error } = await supabase
    .from("credit_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !application) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Kembali ke Dashboard
      </Link>

      <div className="space-y-1">
        <h1 className="text-xl font-bold">Detail Angsuran</h1>
        <p className="text-sm text-muted-foreground">ID: {application.id}</p>
      </div>

      {/* Info Kredit */}
      <div className="border rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Info Kredit</h2>
          <StatusBadge status={application.status} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Harga Motor</p>
            <p className="font-medium">
              Rp {Number(application.price).toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Uang Muka (DP)</p>
            <p className="font-medium">
              Rp {Number(application.dp).toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Tenor</p>
            <p className="font-medium">{application.tenor} bulan</p>
          </div>
          <div>
            <p className="text-muted-foreground">Cicilan / Bulan</p>
            <p className="font-medium">
              Rp {Number(application.installment).toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Bayar</p>
            <p className="font-medium">
              Rp {Number(application.total_payment).toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Bunga</p>
            <p className="font-medium text-orange-600">
              Rp {Number(application.total_interest).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Daftar Angsuran */}
      {application.status === "approved" ? (
        <div className="space-y-3">
          <h2 className="font-semibold">Jadwal Angsuran</h2>
          <PaymentList appId={application.id} />
        </div>
      ) : (
        <div className="border rounded-xl p-6 text-center text-muted-foreground text-sm">
          {application.status === "pending"
            ? "Pengajuan sedang menunggu persetujuan admin."
            : "Pengajuan kredit ditolak."}
        </div>
      )}
    </div>
  );
}