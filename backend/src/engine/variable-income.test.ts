import { describe, it, expect } from "vitest";
import { calculateVariableIncome } from "./variable-income.js";
import { calculateFixedIncome, annualToMonthlyRate } from "./fixed-income.js";

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

  it("with zero volatility, expected matches fixed income calculation with same rate", () => {
    const rate = 0.10;
    const params = {
      initialAmount: 5000,
      monthlyContribution: 200,
      periodMonths: 24,
    };

    const variable = calculateVariableIncome({
      ...params,
      expectedAnnualRate: rate,
      volatility: 0,
    });

    const fixed = calculateFixedIncome({
      ...params,
      annualRate: rate,
    });

    expect(variable.finalExpected).toBeCloseTo(fixed.finalGrossBalance, 2);
  });

  it("upper band uses (expectedRate + volatility)", () => {
    const rate = 0.12;
    const vol = 0.05;
    const params = {
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 12,
    };

    const result = calculateVariableIncome({
      ...params,
      expectedAnnualRate: rate,
      volatility: vol,
    });

    // Upper band should match fixed income with rate + volatility
    const upperAsFixed = calculateFixedIncome({
      ...params,
      annualRate: rate + vol,
    });

    expect(result.finalUpper).toBeCloseTo(upperAsFixed.finalGrossBalance, 2);
  });

  it("lower band uses (expectedRate - volatility)", () => {
    const rate = 0.12;
    const vol = 0.05;
    const params = {
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 12,
    };

    const result = calculateVariableIncome({
      ...params,
      expectedAnnualRate: rate,
      volatility: vol,
    });

    // Lower band should match fixed income with rate - volatility
    const lowerAsFixed = calculateFixedIncome({
      ...params,
      annualRate: rate - vol,
    });

    expect(result.finalLower).toBeCloseTo(lowerAsFixed.finalGrossBalance, 2);
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

  it("high volatility makes bands diverge significantly", () => {
    const result = calculateVariableIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 60,
      expectedAnnualRate: 0.12,
      volatility: 0.20,
    });

    const spread = result.finalUpper - result.finalLower;
    const expectedRange = result.finalExpected - result.totalInvested;
    // High volatility over long period should create large spread
    expect(spread).toBeGreaterThan(expectedRange);
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

  it("with monthly contributions, all bands grow", () => {
    const result = calculateVariableIncome({
      initialAmount: 0,
      monthlyContribution: 500,
      periodMonths: 12,
      expectedAnnualRate: 0.10,
      volatility: 0.03,
    });

    expect(result.totalInvested).toBe(500 * 12);
    expect(result.finalExpected).toBeGreaterThan(result.totalInvested);
  });

  it("series length matches periodMonths", () => {
    for (const period of [1, 6, 12, 24, 60]) {
      const result = calculateVariableIncome({
        initialAmount: 1000,
        monthlyContribution: 0,
        periodMonths: period,
        expectedAnnualRate: 0.10,
        volatility: 0.05,
      });
      expect(result.monthlyEvolution).toHaveLength(period);
    }
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

  it("applies 22.5% IR for 6 months", () => {
    const result = calculateVariableIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 6,
      expectedAnnualRate: 0.12,
      volatility: 0.05,
    });

    expect(result.expectedTaxResult.irRate).toBe(0.225);
  });
});
