"use client";

import { useState } from "react";
import { calculateInstallment } from "../utils/calculate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationResult, CreditInput } from "../types/credit";
import ApplyButton from "./apply-button";
import { Calculator } from "lucide-react";

export default function SimulationForm() {
  const [input, setInput] = useState<CreditInput>({
    price: 0,
    dp: 0,
    tenor: 12,
    interest: 10,
    income: 0,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleCalculate = () => {
    if (input.price <= 0) {
      alert("Masukkan harga motor yang valid");
      return;
    }
    if (input.dp >= input.price) {
      alert("DP tidak boleh lebih besar dari harga motor");
      return;
    }
    const res = calculateInstallment(input);
    setResult(res);
  };

  return (
    <div className="space-y-4 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="size-4" />
            Form Simulasi Kredit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Harga Motor (Rp)</label>
            <Input
              type="number"
              placeholder="Contoh: 25000000"
              min={0}
              onChange={(e) =>
                setInput({ ...input, price: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Uang Muka / DP (Rp)</label>
            <Input
              type="number"
              placeholder="Contoh: 5000000"
              min={0}
              onChange={(e) =>
                setInput({ ...input, dp: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Tenor (bulan)</label>
            <Input
              type="number"
              placeholder="Contoh: 12"
              defaultValue={12}
              min={1}
              max={60}
              onChange={(e) =>
                setInput({ ...input, tenor: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Bunga per tahun (%)</label>
            <Input
              type="number"
              placeholder="Contoh: 10"
              defaultValue={10}
              min={0}
              step={0.1}
              onChange={(e) =>
                setInput({ ...input, interest: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Penghasilan Bulanan (Rp) <span className="text-muted-foreground font-normal">- opsional</span>
            </label>
            <Input
              type="number"
              placeholder="Contoh: 5000000"
              min={0}
              onChange={(e) =>
                setInput({ ...input, income: Number(e.target.value) })
              }
            />
          </div>

          <Button onClick={handleCalculate} className="w-full">
            Hitung Cicilan
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
            <CardHeader>
              <CardTitle className="text-sm text-green-700 dark:text-green-400">
                Hasil Simulasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cicilan / bulan</span>
                <span className="font-semibold">
                  Rp {Math.round(result.installment).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total bayar</span>
                <span className="font-medium">
                  Rp {Math.round(result.totalPayment).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total bunga</span>
                <span className="font-medium text-orange-600">
                  Rp {Math.round(result.totalInterest).toLocaleString("id-ID")}
                </span>
              </div>
            </CardContent>
          </Card>

          <ApplyButton input={input} result={result} />
        </>
      )}
    </div>
  );
}