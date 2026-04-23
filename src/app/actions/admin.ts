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
        get: (name) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );

  const { data, error: fetchError } = await supabase
    .from("credit_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !data) throw new Error("Pengajuan tidak ditemukan");

  const { error: updateError } = await supabase
    .from("credit_applications")
    .update({ status })
    .eq("id", id);

  if (updateError) throw new Error(updateError.message);

  if (status === "approved") {
    await generatePayments(id, data.installment, data.tenor);
  }
}