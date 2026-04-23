export type Payment = {
  id: string;
  amount: number;
  installment_number: number;
  due_date: string;
  status: "paid" | "unpaid";
  paid_at: string | null;
};