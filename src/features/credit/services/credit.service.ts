import { supabase } from "@/lib/supabase-browser";
import { SimulationResult,CreditApplication } from "../types/credit";

export const createCreditApplication = async (
  input: {
    price: number;
    dp: number;
    tenor: number;
    interest: number;
  },
  result: SimulationResult
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

 if (!user) return [];

const { error } = await supabase
  .from("credit_applications")
  .insert({
    user_id: user.id,
    price: input.price,
    dp: input.dp,
    tenor: input.tenor,
    interest: input.interest,
    installment: result.installment,
    total_payment: result.totalPayment,
    total_interest: result.totalInterest,
  });
  if (error) throw new Error(error.message);
};


export const getUserApplications = async (): Promise<CreditApplication[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User tidak ditemukan");

const { data, error } = await supabase
  .from("credit_applications")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false })
  .returns<CreditApplication[]>();

  if (error) throw new Error(error.message);

  return data || [];
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