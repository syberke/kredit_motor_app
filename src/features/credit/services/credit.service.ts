import { supabase } from "@/lib/supabase-browser";
import { SimulationResult, CreditApplication, CreditInput } from "../types/credit";
import { calculateScore, getDecision } from "../utils/scoring";

export const createCreditApplication = async (
  input: CreditInput,
  result: SimulationResult
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User tidak ditemukan, silakan login kembali");

  // Hitung score jika income tersedia
  let score: number | undefined;
  let status: "pending" | "approved" | "rejected" = "pending";

  if (input.income && input.income > 0) {
    score = calculateScore({
      income: input.income,
      price: input.price,
      dp: input.dp,
      tenor: input.tenor,
    });
    status = getDecision(score);
  }

  const { error } = await supabase.from("credit_applications").insert({
    user_id: user.id,
    price: input.price,
    dp: input.dp,
    tenor: input.tenor,
    interest: input.interest,
    installment: result.installment,
    total_payment: result.totalPayment,
    total_interest: result.totalInterest,
    ...(score !== undefined && { score }),
    status,
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

export const getApplicationById = async (id: string): Promise<CreditApplication | null> => {
  const { data, error } = await supabase
    .from("credit_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getPaymentsByApplication = async (applicationId: string) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("application_id", applicationId)
    .order("installment_number");

  if (error) throw new Error(error.message);
  return data;
};