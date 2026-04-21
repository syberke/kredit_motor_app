import { supabase } from "@/lib/supabase-browser";
import { Payment } from "../types/payment";

export const getPayments = async (
  applicationId: string
): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("application_id", applicationId)
    .order("installment_number")
    .returns<Payment[]>();

  if (error) throw new Error(error.message);
  return data || [];
};