export type Payment = {
  id: string;
  application_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: "unpaid" | "paid";
  paid_at: string | null;
};