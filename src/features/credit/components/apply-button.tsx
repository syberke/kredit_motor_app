"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createCreditApplication } from "../services/credit.service";
import { SimulationResult, CreditInput } from "../types/credit";
import { useState } from "react";

export default function ApplyButton({
  input,
  result,
}: {
  input: CreditInput;
  result: SimulationResult;
}) {
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      await createCreditApplication(input, result);
      toast.success("Pengajuan kredit berhasil dikirim!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat mengajukan kredit");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleApply} disabled={loading} className="w-full">
      {loading ? "Memproses..." : "Ajukan Kredit Sekarang"}
    </Button>
  );
}