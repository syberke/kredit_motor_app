"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generatePayments } from "./payment";

export async function updateStatus(
  id: string,
  status: "approved" | "rejected"
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

  const { data, error } = await supabase
    .from("credit_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  await supabase
    .from("credit_applications")
    .update({ status })
    .eq("id", id);

  if (status === "approved") {
    await generatePayments(id, data.installment, data.tenor);
  }
}