"use client";

import { useState } from "react";
import { calculateInstallment } from "../utils/calculate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SimulationResult } from "../types/credit";
import ApplyButton from "./apply-button";

export default function SimulationForm() {
  const [input, setInput] = useState({
    price: 0,
    dp: 0,
    tenor: 12,
    interest: 10,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleCalculate = () => {
    const res = calculateInstallment(input);
    setResult(res);
  };

  return (
    <div className="space-y-4 max-w-md">
      <Input
        type="number"
        placeholder="Harga Motor"
        onChange={(e) =>
          setInput({ ...input, price: Number(e.target.value) })
        }
      />

      <Input
        type="number"
        placeholder="DP"
        onChange={(e) =>
          setInput({ ...input, dp: Number(e.target.value) })
        }
      />

      <Input
        type="number"
        placeholder="Tenor (bulan)"
        onChange={(e) =>
          setInput({ ...input, tenor: Number(e.target.value) })
        }
      />

      <Input
        type="number"
        placeholder="Bunga (%)"
        onChange={(e) =>
          setInput({ ...input, interest: Number(e.target.value) })
        }
      />

      <Button onClick={handleCalculate}>
        Hitung Cicilan
      </Button>

      {result && (
        <>
          <Card>
            <CardContent className="space-y-2 p-4">
              <p>
                Cicilan / bulan: Rp {result.installment.toFixed(0)}
              </p>
              <p>
                Total bayar: Rp {result.totalPayment.toFixed(0)}
              </p>
              <p>
                Total bunga: Rp {result.totalInterest.toFixed(0)}
              </p>
            </CardContent>
          </Card>

          {/* 🔥 Integrasi pengajuan */}
          <ApplyButton input={input} result={result} />
        </>
      )}
    </div>
  );
}