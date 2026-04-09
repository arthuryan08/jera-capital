import { annualToMonthlyRate } from "./fixed-income.js";
import { calculateTax, type TaxResult } from "./tax.js";

export interface VariableBand {
  month: number;
  expected: number;
  upper: number;
  lower: number;
  totalInvested: number;
}

export interface VariableIncomeResult {
  monthlyEvolution: VariableBand[];
  finalExpected: number;
  finalUpper: number;
  finalLower: number;
  totalInvested: number;
  expectedTaxResult: TaxResult;
}

export function calculateVariableIncome(params: {
  initialAmount: number;
  monthlyContribution: number;
  periodMonths: number;
  expectedAnnualRate: number;
  volatility: number;
}): VariableIncomeResult {
  const { initialAmount, monthlyContribution, periodMonths, expectedAnnualRate, volatility } = params;

  const expectedMonthly = annualToMonthlyRate(expectedAnnualRate);
  const upperMonthly = annualToMonthlyRate(expectedAnnualRate + volatility);
  const lowerMonthly = annualToMonthlyRate(Math.max(0, expectedAnnualRate - volatility));

  const monthlyEvolution: VariableBand[] = [];
  let expectedBalance = initialAmount;
  let upperBalance = initialAmount;
  let lowerBalance = initialAmount;

  for (let month = 1; month <= periodMonths; month++) {
    expectedBalance = expectedBalance * (1 + expectedMonthly) + monthlyContribution;
    upperBalance = upperBalance * (1 + upperMonthly) + monthlyContribution;
    lowerBalance = lowerBalance * (1 + lowerMonthly) + monthlyContribution;

    monthlyEvolution.push({
      month,
      expected: Math.round(expectedBalance * 100) / 100,
      upper: Math.round(upperBalance * 100) / 100,
      lower: Math.round(lowerBalance * 100) / 100,
      totalInvested: initialAmount + monthlyContribution * month,
    });
  }

  const finalExpected = Math.round(expectedBalance * 100) / 100;
  const finalUpper = Math.round(upperBalance * 100) / 100;
  const finalLower = Math.round(lowerBalance * 100) / 100;
  const totalInvested = initialAmount + monthlyContribution * periodMonths;

  const grossExpectedIncome = Math.round((finalExpected - totalInvested) * 100) / 100;
  const holdingDays = periodMonths * 30;
  const expectedTaxResult = calculateTax(Math.max(0, grossExpectedIncome), holdingDays);

  return {
    monthlyEvolution,
    finalExpected,
    finalUpper,
    finalLower,
    totalInvested,
    expectedTaxResult,
  };
}
