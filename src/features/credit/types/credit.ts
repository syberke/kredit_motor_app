export type SimulationResult = {
  installment: number;
  totalPayment: number;
  totalInterest: number;
};
export type CreditApplication = {
  id: string;
  price: number;
  dp: number;
  tenor: number;
  interest: number;
  installment: number;
  total_payment: number;
  total_interest: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};