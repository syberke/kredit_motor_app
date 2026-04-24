import { supabase } from "@/lib/supabase-browser";

export type Payment = {
  id: string;
  application_id: string;
  installment_number: number;
  amount: number;
  status: "unpaid" | "pending" | "paid" | "failed";
  midtrans_order_id: string | null;
  order_id: string | null;
  snap_token?: string | null;
  paid_at: string | null;
};

export const getPayments = async (
  appId: string
): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("application_id", appId)
    .order("installment_number", { ascending: true });

  if (error) throw new Error(error.message);

  return data || [];
};