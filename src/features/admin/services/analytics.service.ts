import { supabase } from "@/lib/supabase-browser";

export const getAnalytics = async () => {
  const { data: payments } = await supabase
    .from("payments")
    .select("*");

  const { data: applications } = await supabase
    .from("credit_applications")
    .select("*");

  return { payments: payments || [], applications: applications || [] };
};