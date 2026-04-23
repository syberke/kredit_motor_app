export type ScoringInput = {
  income: number;
  price: number;
  dp: number;
  tenor: number;
};

export const calculateScore = (data: ScoringInput): number => {
  let score = 0;

  // 1. DP besar = bagus
  const dpRatio = data.dp / data.price;
  if (dpRatio >= 0.3) score += 30;
  else if (dpRatio >= 0.2) score += 20;
  else score += 10;

  // 2. Cicilan vs income
  const monthlyInstallment = (data.price - data.dp) / data.tenor;
  const ratio = monthlyInstallment / data.income;

  if (ratio < 0.3) score += 40;
  else if (ratio < 0.5) score += 25;
  else score += 10;

  // 3. Tenor (semakin pendek lebih bagus)
  if (data.tenor <= 12) score += 20;
  else if (data.tenor <= 24) score += 15;
  else score += 5;

  // 4. Income level
  if (data.income > 5000000) score += 10;
  else score += 5;

  return score;
};

export const getDecision = (score: number): "approved" | "rejected" | "pending" => {
  if (score >= 70) return "approved";
  if (score >= 50) return "pending";
  return "rejected";
};