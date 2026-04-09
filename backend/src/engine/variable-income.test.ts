import { describe, it, expect } from "vitest";
import { calculateVariableIncome } from "./variable-income.js";
import { annualToMonthlyRate } from "./fixed-income.js";

describe("calculateVariableIncome", () => {
  it("with zero volatility, expected line matches fixed income math", () => {
    const result = calculateVariableIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 12,
      expectedAnnualRate: 0.12,
      volatility: 0,
    });

    expect(result.monthlyEvolution).toHaveLength(12);
    // With 0 volatility, upper = lower = expected
    expect(result.finalExpected).toBeCloseTo(result.finalUpper, 2);
    expect(result.finalExpected).toBeCloseTo(result.finalLower, 2);
    expect(result.finalExpected).toBeCloseTo(11200, 0);
  });

  it("upper band is higher than expected, lower is lower", () => {
    const result = calculateVariableIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 12,
      expectedAnnualRate: 0.12,
      volatility: 0.05,
    });

    expect(result.finalUpper).toBeGreaterThan(result.finalExpected);
    expect(result.finalLower).toBeLessThan(result.finalExpected);
  });

  it("returns correct month-by-month evolution with bands", () => {
    const result = calculateVariableIncome({
      initialAmount: 1000,
      monthlyContribution: 100,
      periodMonths: 3,
      expectedAnnualRate: 0.10,
      volatility: 0.03,
    });

    expect(result.monthlyEvolution).toHaveLength(3);
    for (const point of result.monthlyEvolution) {
      expect(point.upper).toBeGreaterThanOrEqual(point.expected);
      expect(point.lower).toBeLessThanOrEqual(point.expected);
      expect(point.totalInvested).toBeGreaterThan(0);
    }
  });

  it("handles zero period", () => {
    const result = calculateVariableIncome({
      initialAmount: 5000,
      monthlyContribution: 0,
      periodMonths: 0,
      expectedAnnualRate: 0.10,
      volatility: 0.05,
    });

    expect(result.monthlyEvolution).toHaveLength(0);
    expect(result.finalExpected).toBe(5000);
    expect(result.totalInvested).toBe(5000);
  });

  it("computes totalInvested correctly with contributions", () => {
    const result = calculateVariableIncome({
      initialAmount: 1000,
      monthlyContribution: 200,
      periodMonths: 6,
      expectedAnnualRate: 0.15,
      volatility: 0.04,
    });

    expect(result.totalInvested).toBe(1000 + 200 * 6);
  });

  it("applies tax to expected result", () => {
    const result = calculateVariableIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 12,
      expectedAnnualRate: 0.12,
      volatility: 0.05,
    });

    expect(result.expectedTaxResult.irRate).toBe(0.20); // 360 days
    expect(result.expectedTaxResult.iofRate).toBe(0);
  });
});
