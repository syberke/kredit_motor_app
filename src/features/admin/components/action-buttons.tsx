"use client";

import { updateStatus } from "@/app/actions/admin";
import { useTransition } from "react";

export default function ActionButtons({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        disabled={pending}
        onClick={() =>
          startTransition(() => updateStatus(id, "approved"))
        }
      >
        Approve
      </button>

      <button
        disabled={pending}
        onClick={() =>
          startTransition(() => updateStatus(id, "rejected"))
        }
      >
        Reject
      </button>
    </div>
  );
}

export async function markAsPaid(id: string) {
  const supabase = createServerClient(...);

  await supabase
    .from("payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", id);
}

import { generatePayments } from "./payment";

export async function updateStatus(id: string, status: string) {
  const supabase = createServerClient(...);

  const { data } = await supabase
    .from("credit_applications")
    .select("*")
    .eq("id", id)
    .single();

  await supabase
    .from("credit_applications")
    .update({ status })
    .eq("id", id);

  if (status === "approved") {
    await generatePayments(
      id,
      data.installment,
      data.tenor
    );
  }
}