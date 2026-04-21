"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createCreditApplication } from "../services/credit.service";
import { SimulationResult } from "../types/credit";

export default function ApplyButton({
  input,
  result,
}: {
  input: {
    price: number;
    dp: number;
    tenor: number;
    interest: number;
  };
  result: SimulationResult;
}) {
  const handleApply = async () => {
    try {
      await createCreditApplication(input, result);
      toast.success("Pengajuan berhasil!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan");
      }
    }
  };

  return (
    <Button onClick={handleApply}>
      Ajukan Kredit
    </Button>
  );
}