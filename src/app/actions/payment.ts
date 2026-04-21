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
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options) =>
          cookieStore.set({ name, value, ...options }),
        remove: (name: string, options) =>
          cookieStore.set({ name, value: "", ...options }),
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
      amount: installment,
      due_date: dueDate.toISOString().split("T")[0],
    };
  });

  const { error } = await supabase.from("payments").insert(payments);

  if (error) throw new Error(error.message);
}