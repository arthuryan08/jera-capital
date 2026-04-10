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

  it("converts 10% annual to ~0.7974% monthly (NOT 0.8333%)", () => {
    const monthly = annualToMonthlyRate(0.10);
    // Compound: (1.10)^(1/12) - 1 ≈ 0.007974
    expect(monthly).toBeCloseTo(0.007974, 4);
    // Must NOT be simple division
    expect(monthly).not.toBeCloseTo(0.10 / 12, 4);
  });

  it("converts 0% annual to 0% monthly", () => {
    expect(annualToMonthlyRate(0)).toBe(0);
  });

  it("converts 100% annual to correct monthly", () => {
    const monthly = annualToMonthlyRate(1.0);
    // (1 + 1)^(1/12) - 1 = 2^(1/12) - 1 ≈ 0.05946
    expect(monthly).toBeCloseTo(0.05946, 4);
  });

  it("converts small rate (1% annual)", () => {
    const monthly = annualToMonthlyRate(0.01);
    expect(monthly).toBeCloseTo(0.000830, 4);
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

  it("calculates with zero initial amount and monthly contribution only", () => {
    const result = calculateFixedIncome({
      initialAmount: 0,
      monthlyContribution: 500,
      periodMonths: 12,
      annualRate: 0.10,
    });

    expect(result.totalInvested).toBe(500 * 12);
    expect(result.finalGrossBalance).toBeGreaterThan(6000);
    expect(result.grossIncome).toBeGreaterThan(0);
  });

  it("calculates with zero monthly contribution (initial amount only)", () => {
    const result = calculateFixedIncome({
      initialAmount: 5000,
      monthlyContribution: 0,
      periodMonths: 24,
      annualRate: 0.08,
    });

    expect(result.totalInvested).toBe(5000);
    expect(result.finalGrossBalance).toBeGreaterThan(5000);
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

    // Month 2: month1 * (1 + monthlyRate)
    const expectedMonth2 = 1000 * (1 + monthlyRate) * (1 + monthlyRate);
    expect(result.monthlyEvolution[1].grossBalance).toBeCloseTo(expectedMonth2, 2);

    // Each month's totalInvested stays 1000
    expect(result.monthlyEvolution[0].totalInvested).toBe(1000);
    expect(result.monthlyEvolution[2].totalInvested).toBe(1000);
  });

  it("spot checks compound interest at month 1 with contributions", () => {
    const result = calculateFixedIncome({
      initialAmount: 1000,
      monthlyContribution: 100,
      periodMonths: 3,
      annualRate: 0.12,
    });

    const monthlyRate = annualToMonthlyRate(0.12);

    // Month 1: (1000 * (1 + rate)) + 100
    const expectedMonth1 = 1000 * (1 + monthlyRate) + 100;
    expect(result.monthlyEvolution[0].grossBalance).toBeCloseTo(expectedMonth1, 2);
    expect(result.monthlyEvolution[0].totalInvested).toBe(1100);
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

  it("handles period of 1 month", () => {
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 1,
      annualRate: 0.12,
    });

    expect(result.monthlyEvolution).toHaveLength(1);
    const monthlyRate = annualToMonthlyRate(0.12);
    expect(result.finalGrossBalance).toBeCloseTo(10000 * (1 + monthlyRate), 2);
  });

  it("handles period of 60 months", () => {
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 500,
      periodMonths: 60,
      annualRate: 0.10,
    });

    expect(result.monthlyEvolution).toHaveLength(60);
    expect(result.totalInvested).toBe(10000 + 500 * 60);
    expect(result.finalGrossBalance).toBeGreaterThan(result.totalInvested);
  });

  it("handles period of 120 months", () => {
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 500,
      periodMonths: 120,
      annualRate: 0.10,
    });

    expect(result.monthlyEvolution).toHaveLength(120);
    expect(result.totalInvested).toBe(10000 + 500 * 120);
    expect(result.finalGrossBalance).toBeGreaterThan(result.totalInvested);
  });

  it("with zero interest rate, balance equals initial + contributions", () => {
    const result = calculateFixedIncome({
      initialAmount: 1000,
      monthlyContribution: 100,
      periodMonths: 12,
      annualRate: 0,
    });

    expect(result.totalInvested).toBe(2200);
    expect(result.finalGrossBalance).toBeCloseTo(2200, 2);
    expect(result.grossIncome).toBeCloseTo(0, 2);
  });

  it("handles large values for precision", () => {
    const result = calculateFixedIncome({
      initialAmount: 1000000,
      monthlyContribution: 10000,
      periodMonths: 120,
      annualRate: 0.15,
    });

    expect(result.monthlyEvolution).toHaveLength(120);
    expect(result.totalInvested).toBe(1000000 + 10000 * 120);
    expect(result.finalGrossBalance).toBeGreaterThan(result.totalInvested);
    // Should be a finite number, no NaN or Infinity
    expect(Number.isFinite(result.finalGrossBalance)).toBe(true);
  });

  it("series length equals periodMonths", () => {
    for (const period of [1, 6, 12, 24, 60]) {
      const result = calculateFixedIncome({
        initialAmount: 1000,
        monthlyContribution: 0,
        periodMonths: period,
        annualRate: 0.10,
      });
      expect(result.monthlyEvolution).toHaveLength(period);
    }
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

  it("applies 20% IR for 12 months (360 days)", () => {
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 12,
      annualRate: 0.12,
    });

    expect(result.taxResult.irRate).toBe(0.20);
    expect(result.taxResult.iofRate).toBe(0);
  });

  it("applies 17.5% IR for 24 months (720 days)", () => {
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 24,
      annualRate: 0.12,
    });

    expect(result.taxResult.irRate).toBe(0.175);
  });

  it("applies 15% IR for 25+ months (>720 days)", () => {
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 25,
      annualRate: 0.12,
    });

    expect(result.taxResult.irRate).toBe(0.15);
  });
});
