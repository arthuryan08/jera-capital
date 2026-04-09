export interface TaxResult {
  grossIncome: number;
  iofRate: number;
  iofAmount: number;
  irRate: number;
  irAmount: number;
  netIncome: number;
}

export function calculateIOFRate(days: number): number {
  if (days >= 30) return 0;
  const rate = (96 - (days - 1) * 3) / 100;
  return Math.max(0, rate);
}

export function calculateIRRate(days: number): number {
  if (days <= 180) return 0.225;
  if (days <= 360) return 0.20;
  if (days <= 720) return 0.175;
  return 0.15;
}

export function calculateTax(grossIncome: number, holdingDays: number): TaxResult {
  const iofRate = calculateIOFRate(holdingDays);
  const iofAmount = Math.round(grossIncome * iofRate * 100) / 100;

  const incomeAfterIOF = grossIncome - iofAmount;

  const irRate = calculateIRRate(holdingDays);
  const irAmount = Math.round(incomeAfterIOF * irRate * 100) / 100;

  const netIncome = Math.round((incomeAfterIOF - irAmount) * 100) / 100;

  return {
    grossIncome,
    iofRate,
    iofAmount,
    irRate,
    irAmount,
    netIncome,
  };
}
