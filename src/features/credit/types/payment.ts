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