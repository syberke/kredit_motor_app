"use client";

import { useEffect, useState, useCallback } from "react";
import { getPayments, Payment } from "../services/payment.service";
import { Button } from "@/components/ui/button";
import { generateInvoice } from "../services/invoice.service";
import { createTransaction } from "@/app/actions/midtrans";
import { markAsPaidById } from "@/app/actions/payment";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { 
  Check, 
  Clock, 
  Download, 
  ArrowRight,
  Wallet
} from "lucide-react";

export default function PaymentList({ appId }: { appId: string }) {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPayments(appId);
      setData(res);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data cicilan.");
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleDownload = async (payment: Payment) => {
    try {
      toast.info("Menyiapkan dokumen invoice...");
      const pdfBytes = await generateInvoice({
        id: payment.id,
        amount: payment.amount,
        installment_number: payment.installment_number,
        paid_at: payment.paid_at ?? new Date().toISOString(),
      });

      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      Swal.fire("Oops!", "Gagal mengunduh invoice.", "error");
    }
  };

  const confirmPayment = (payment: Payment) => {
    Swal.fire({
      title: "Proses Pembayaran",
      html: `Anda akan membayar tagihan sebesar <b>Rp ${payment.amount.toLocaleString("id-ID")}</b>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#f97316", // orange-500
      cancelButtonColor: "#f1f5f9", // slate-100
      confirmButtonText: "Ya, Lanjut",
      cancelButtonText: "<span style='color: #475569'>Batal</span>",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-lg px-6 py-2.5 shadow-none",
        cancelButton: "rounded-lg px-6 py-2.5 shadow-none"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handlePay(payment);
      }
    });
  };

  const handlePay = async (payment: Payment) => {
    try {
      setPayingId(payment.id);
      Swal.fire({
        title: 'Memproses...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const token = await createTransaction(payment.id, Math.round(payment.amount));
      Swal.close();

      window.snap.pay(token, {
        onSuccess: () => {
          (async () => {
            try {
              await markAsPaidById(payment.id);
              Swal.fire({
                title: "Berhasil!",
                text: "Pembayaran telah diterima.",
                icon: "success",
                confirmButtonColor: "#10b981", // emerald-500
                customClass: { popup: "rounded-2xl" }
              });
              fetchPayments();
            } catch {
              Swal.fire("Perhatian", "Pembayaran sukses namun status delay.", "warning");
            }
          })();
        },
        onPending: () => Swal.fire("Tertunda", "Selesaikan instruksi pembayaran Anda.", "info"),
        onError: () => Swal.fire("Gagal", "Transaksi dibatalkan.", "error"),
      });
    } catch (err) {
      Swal.fire("Error", "Gagal memproses pembayaran.", "error");
    } finally {
      setPayingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-500">Memuat riwayat cicilan...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-slate-900">Riwayat Cicilan</h2>
        <p className="text-sm text-slate-500 mt-1">Pantau dan bayar tagihan Anda tepat waktu.</p>
      </div>

      <div className="relative">
        {/* Garis Vertikal Tipis (Timeline Line) */}
        <div className="absolute top-6 bottom-6 left-[23px] w-[2px] bg-slate-100 hidden sm:block z-0"></div>

        <div className="space-y-5">
          {data.map((p) => {
            const isPaid = p.status === "paid";
            const isPending = p.status === "pending";
            
            // Konfigurasi visual Node (Bulatan kiri)
            let nodeColor = "bg-slate-900 text-white"; // Default (Misal belum lunas / aktif)
            let NodeIcon = Wallet;

            if (isPaid) {
              nodeColor = "bg-emerald-500 text-white";
              NodeIcon = Check;
            } else if (p.status === "unpaid" || isPending) {
              nodeColor = "bg-[#fecb73] text-white"; // Warna oranye pastel sesuai gambar
              NodeIcon = Clock;
            }

            return (
              <div key={p.id} className="relative flex items-center gap-5 sm:gap-6 z-10">
                
                {/* Node Icon Bulat */}
                <div className={`hidden sm:flex shrink-0 w-12 h-12 rounded-2xl items-center justify-center ${nodeColor}`}>
                  <NodeIcon className="w-5 h-5" />
                </div>

                {/* Card Konten Utama */}
                <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 sm:px-8 sm:py-7 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-shadow hover:shadow-sm">
                  
                  {/* Bagian Kiri: Info Angka */}
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                      Cicilan {p.installment_number}
                    </span>
                    
                    {/* Menggunakan font-serif untuk nominal sesuai referensi desain */}
                    <h3 className={`text-3xl font-serif font-bold ${isPaid ? 'text-slate-400' : 'text-slate-900'}`}>
                      Rp {p.amount.toLocaleString("id-ID")}
                    </h3>

                    {/* Tulisan Lunas Hijau di bawah nominal (Jika lunas) */}
                    {isPaid && p.paid_at && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-500">
                        <Check className="w-4 h-4" />
                        Lunas pada {new Date(p.paid_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>

                  {/* Bagian Kanan: Tombol */}
                  <div className="shrink-0">
                    {isPaid ? (
                      <button 
                        onClick={() => handleDownload(p)}
                        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Unduh Invoice
                      </button>
                    ) : (
                      <Button
                        disabled={payingId === p.id}
                        onClick={() => isPending ? window.snap.pay(p.snap_token!) : confirmPayment(p)}
                        className="w-full md:w-auto bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-xl px-7 py-6 h-auto shadow-sm font-medium"
                      >
                        {payingId === p.id ? "Memproses..." : "Lanjut Bayar"}
                        {!payingId && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}