export type SimulationResult = {
  installment: number;
  totalPayment: number;
  totalInterest: number;
};

export type CreditApplication = {
  id: string;
  user_id: string;
  price: number;
  dp: number;
  tenor: number;
  interest: number;
  installment: number;
  total_payment: number;
  total_interest: number;
  income?: number;
  score?: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type CreditInput = {
  price: number;
  dp: number;
  tenor: number;
  interest: number;
  income?: number;
};