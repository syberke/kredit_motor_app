import { supabase } from "@/lib/supabase-browser";
import { CreditApplication } from "@/features/credit/types/credit";

export const getAllApplications = async (): Promise<CreditApplication[]> => {
  const { data, error } = await supabase
    .from("credit_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<CreditApplication[]>();

  if (error) throw new Error(error.message);
  return data || [];
};

export const updateApplicationStatus = async (
  id: string,
  status: "approved" | "rejected"
) => {
  const { error } = await supabase
    .from("credit_applications")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const getPayments = async (applicationId: string) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("application_id", applicationId)
    .order("installment_number");

  if (error) throw new Error(error.message);
  return data;
};