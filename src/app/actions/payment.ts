"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function generatePayments(
  applicationId: string,
  installment: number,
  tenor: number
) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );

  const today = new Date();

  const payments = Array.from({ length: tenor }, (_, i) => {
    const dueDate = new Date(today);
    dueDate.setMonth(today.getMonth() + (i + 1));

    return {
      application_id: applicationId,
      installment_number: i + 1,
      amount: Math.round(installment),
      due_date: dueDate.toISOString().split("T")[0],
      status: "unpaid",
    };
  });

  const { error } = await supabase.from("payments").insert(payments);

  if (error) throw new Error(error.message);
}

export async function markAsPaid(id: string) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );

  const { error } = await supabase
    .from("payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}