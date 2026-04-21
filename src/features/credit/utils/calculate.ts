import { SimulationResult } from "../types/credit";

export const calculateInstallment = ({
  price,
  dp,
  tenor,
  interest,
}: {
  price: number;
  dp: number;
  tenor: number;
  interest: number;
}): SimulationResult => {
  const loan = price - dp;
  const monthlyRate = interest / 100 / 12;

  const installment =
    loan *
    (monthlyRate / (1 - Math.pow(1 + monthlyRate, -tenor)));

  const totalPayment = installment * tenor;
  const totalInterest = totalPayment - loan;

  return {
    installment,
    totalPayment,
    totalInterest,
  };
};