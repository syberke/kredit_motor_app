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
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10 font-sans">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Dashboard
      </Link>

      {/* Header Info Kredit */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">Detail Angsuran</h1>
            <p className="text-sm text-slate-500 mt-1">ID Pengajuan: {application.id}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-slate-500 mb-1">Harga Motor</p>
            <p className="font-semibold text-slate-800">
              Rp {Number(application.price).toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Uang Muka (DP)</p>
            <p className="font-semibold text-slate-800">
              Rp {Number(application.dp).toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Tenor</p>
            <p className="font-semibold text-slate-800">{application.tenor} bulan</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Cicilan / Bulan</p>
            <p className="font-semibold text-slate-800">
              Rp {Number(application.installment).toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Total Bunga</p>
            <p className="font-semibold text-orange-500">
              Rp {Number(application.total_interest).toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Total Bayar</p>
            <p className="font-semibold text-slate-800">
              Rp {Number(application.total_payment).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Daftar Angsuran (Timeline) */}
      {application.status === "approved" ? (
        <div className="space-y-4">
          <PaymentList appId={application.id} />
        </div>
      ) : (
        <div className="border border-dashed border-slate-200 rounded-3xl p-10 text-center text-slate-500 bg-slate-50/50">
          {application.status === "pending"
            ? "Pengajuan sedang menunggu persetujuan admin."
            : "Pengajuan kredit ditolak."}
        </div>
      )}
    </div>
  );
}