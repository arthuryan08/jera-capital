import { calculateTax, type TaxResult } from "./tax.js";

export interface MonthlyDataPoint {
  month: number;
  totalInvested: number;
  grossBalance: number;
  monthlyInterest: number;
}

export interface FixedIncomeResult {
  monthlyEvolution: MonthlyDataPoint[];
  finalGrossBalance: number;
  finalNetBalance: number;
  totalInvested: number;
  grossIncome: number;
  taxResult: TaxResult;
}

export function annualToMonthlyRate(annualRate: number): number {
  if (annualRate === 0) return 0;
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

export function calculateFixedIncome(params: {
  initialAmount: number;
  monthlyContribution: number;
  periodMonths: number;
  annualRate: number;
}): FixedIncomeResult {
  const { initialAmount, monthlyContribution, periodMonths, annualRate } = params;
  const monthlyRate = annualToMonthlyRate(annualRate);

  const monthlyEvolution: MonthlyDataPoint[] = [];
  let balance = initialAmount;

  for (let month = 1; month <= periodMonths; month++) {
    const interest = balance * monthlyRate;
    balance = balance + interest + monthlyContribution;

    monthlyEvolution.push({
      month,
      totalInvested: initialAmount + monthlyContribution * month,
      grossBalance: Math.round(balance * 100) / 100,
      monthlyInterest: Math.round(interest * 100) / 100,
    });
  }

  const finalGrossBalance = Math.round(balance * 100) / 100;
  const totalInvested = initialAmount + monthlyContribution * periodMonths;
  const grossIncome = Math.round((finalGrossBalance - totalInvested) * 100) / 100;

  const holdingDays = periodMonths * 30;
  const taxResult = calculateTax(grossIncome, holdingDays);
  const finalNetBalance = Math.round((totalInvested + taxResult.netIncome) * 100) / 100;

  return {
    monthlyEvolution,
    finalGrossBalance,
    finalNetBalance,
    totalInvested,
    grossIncome,
    taxResult,
  };
}
