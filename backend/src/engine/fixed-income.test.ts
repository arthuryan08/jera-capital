import { describe, it, expect } from "vitest";
import {
  annualToMonthlyRate,
  calculateFixedIncome,
} from "./fixed-income.js";

describe("annualToMonthlyRate", () => {
  it("converts 12% annual to ~0.9489% monthly", () => {
    const monthly = annualToMonthlyRate(0.12);
    expect(monthly).toBeCloseTo(0.009489, 4);
  });

  it("converts 0% annual to 0% monthly", () => {
    expect(annualToMonthlyRate(0)).toBe(0);
  });

  it("converts 100% annual to correct monthly", () => {
    const monthly = annualToMonthlyRate(1.0);
    // (1 + 1)^(1/12) - 1 = 2^(1/12) - 1 ≈ 0.05946
    expect(monthly).toBeCloseTo(0.05946, 4);
  });
});

describe("calculateFixedIncome", () => {
  it("calculates correctly with no monthly contribution", () => {
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 12,
      annualRate: 0.12,
    });

    expect(result.monthlyEvolution).toHaveLength(12);
    expect(result.totalInvested).toBe(10000);
    // After 12 months at 12% annual: 10000 * (1.12) = 11200
    expect(result.finalGrossBalance).toBeCloseTo(11200, 0);
    expect(result.grossIncome).toBeCloseTo(1200, 0);
  });

  it("calculates correctly with monthly contributions", () => {
    const result = calculateFixedIncome({
      initialAmount: 1000,
      monthlyContribution: 100,
      periodMonths: 12,
      annualRate: 0.12,
    });

    expect(result.monthlyEvolution).toHaveLength(12);
    expect(result.totalInvested).toBe(1000 + 100 * 12); // 2200
    expect(result.finalGrossBalance).toBeGreaterThan(2200);
  });

  it("returns correct month-by-month evolution", () => {
    const result = calculateFixedIncome({
      initialAmount: 1000,
      monthlyContribution: 0,
      periodMonths: 3,
      annualRate: 0.12,
    });

    expect(result.monthlyEvolution).toHaveLength(3);

    const monthlyRate = annualToMonthlyRate(0.12);

    // Month 1: 1000 * (1 + monthlyRate)
    expect(result.monthlyEvolution[0].month).toBe(1);
    expect(result.monthlyEvolution[0].grossBalance).toBeCloseTo(
      1000 * (1 + monthlyRate),
      2
    );

    // Each month's totalInvested stays 1000
    expect(result.monthlyEvolution[0].totalInvested).toBe(1000);
    expect(result.monthlyEvolution[2].totalInvested).toBe(1000);
  });

  it("handles zero period", () => {
    const result = calculateFixedIncome({
      initialAmount: 1000,
      monthlyContribution: 0,
      periodMonths: 0,
      annualRate: 0.12,
    });

    expect(result.monthlyEvolution).toHaveLength(0);
    expect(result.finalGrossBalance).toBe(1000);
    expect(result.totalInvested).toBe(1000);
    expect(result.grossIncome).toBe(0);
  });

  it("applies tax correctly to final result", () => {
    // 6 months = 180 days => IR 22.5%, no IOF (>30 days)
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 6,
      annualRate: 0.12,
    });

    expect(result.taxResult.irRate).toBe(0.225);
    expect(result.taxResult.iofRate).toBe(0);
    expect(result.finalNetBalance).toBeLessThan(result.finalGrossBalance);
    expect(result.finalNetBalance).toBeGreaterThan(result.totalInvested);
  });
});
