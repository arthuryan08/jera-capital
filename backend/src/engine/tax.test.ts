import { describe, it, expect } from "vitest";
import { calculateIOFRate, calculateIRRate, calculateTax } from "./tax.js";

describe("calculateIOFRate", () => {
  it("returns 96% for day 1", () => {
    expect(calculateIOFRate(1)).toBe(0.96);
  });

  it("returns 93% for day 2", () => {
    expect(calculateIOFRate(2)).toBe(0.93);
  });

  it("returns 69% for day 10", () => {
    expect(calculateIOFRate(10)).toBe(0.69);
  });

  it("returns 12% for day 29", () => {
    expect(calculateIOFRate(29)).toBe(0.12);
  });

  it("returns 0% for day 30", () => {
    expect(calculateIOFRate(30)).toBe(0);
  });

  it("returns 0% for day 31", () => {
    expect(calculateIOFRate(31)).toBe(0);
  });

  it("returns 0% for day 365", () => {
    expect(calculateIOFRate(365)).toBe(0);
  });

  it("handles day 0 gracefully (returns capped at 0)", () => {
    const rate = calculateIOFRate(0);
    expect(rate).toBeGreaterThanOrEqual(0);
  });

  it("handles negative days gracefully (returns capped at 0)", () => {
    const rate = calculateIOFRate(-5);
    expect(rate).toBeGreaterThanOrEqual(0);
  });
});

describe("calculateIRRate", () => {
  it("returns 22.5% for day 1", () => {
    expect(calculateIRRate(1)).toBe(0.225);
  });

  it("returns 22.5% for day 180 (boundary)", () => {
    expect(calculateIRRate(180)).toBe(0.225);
  });

  it("returns 20% for day 181 (boundary)", () => {
    expect(calculateIRRate(181)).toBe(0.20);
  });

  it("returns 20% for day 360 (boundary)", () => {
    expect(calculateIRRate(360)).toBe(0.20);
  });

  it("returns 17.5% for day 361 (boundary)", () => {
    expect(calculateIRRate(361)).toBe(0.175);
  });

  it("returns 17.5% for day 720 (boundary)", () => {
    expect(calculateIRRate(720)).toBe(0.175);
  });

  it("returns 15% for day 721 (boundary)", () => {
    expect(calculateIRRate(721)).toBe(0.15);
  });

  it("returns 15% for day 1000", () => {
    expect(calculateIRRate(1000)).toBe(0.15);
  });
});

describe("calculateTax", () => {
  it("matches the spec example: R$50 gross income, day 10 -> net R$12.01", () => {
    const result = calculateTax(50, 10);

    expect(result.grossIncome).toBe(50);
    expect(result.iofRate).toBe(0.69);
    expect(result.iofAmount).toBeCloseTo(34.50, 2);
    expect(result.irRate).toBe(0.225);
    expect(result.irAmount).toBeCloseTo(3.49, 2);
    expect(result.netIncome).toBeCloseTo(12.01, 2);
  });

  it("applies zero IOF after 30 days", () => {
    const result = calculateTax(100, 31);

    expect(result.iofRate).toBe(0);
    expect(result.iofAmount).toBe(0);
    expect(result.irRate).toBe(0.225);
    expect(result.irAmount).toBeCloseTo(22.50, 2);
    expect(result.netIncome).toBeCloseTo(77.50, 2);
  });

  it("handles zero gross income", () => {
    const result = calculateTax(0, 10);

    expect(result.grossIncome).toBe(0);
    expect(result.iofAmount).toBe(0);
    expect(result.irAmount).toBe(0);
    expect(result.netIncome).toBe(0);
  });

  it("handles zero gross income at all IR brackets", () => {
    for (const days of [1, 180, 181, 360, 361, 720, 721]) {
      const result = calculateTax(0, days);
      expect(result.netIncome).toBe(0);
    }
  });

  it("applies correct IR rate at 361 days with no IOF", () => {
    const result = calculateTax(1000, 361);

    expect(result.iofRate).toBe(0);
    expect(result.irRate).toBe(0.175);
    expect(result.irAmount).toBeCloseTo(175, 2);
    expect(result.netIncome).toBeCloseTo(825, 2);
  });

  it("applies correct IR rate above 720 days", () => {
    const result = calculateTax(1000, 721);

    expect(result.iofRate).toBe(0);
    expect(result.irRate).toBe(0.15);
    expect(result.irAmount).toBeCloseTo(150, 2);
    expect(result.netIncome).toBeCloseTo(850, 2);
  });

  it("applies IOF first, then IR on remainder (order matters)", () => {
    const result = calculateTax(100, 1);

    // IOF day 1 = 96%: 100 * 0.96 = 96
    expect(result.iofAmount).toBeCloseTo(96, 2);
    // Income after IOF: 100 - 96 = 4
    // IR 22.5% on 4 = 0.90
    expect(result.irAmount).toBeCloseTo(0.9, 2);
    // Net: 4 - 0.90 = 3.10
    expect(result.netIncome).toBeCloseTo(3.10, 2);
  });

  it("handles large values with precision (R$1,000,000)", () => {
    const result = calculateTax(1000000, 721);

    expect(result.iofRate).toBe(0);
    expect(result.irRate).toBe(0.15);
    expect(result.irAmount).toBeCloseTo(150000, 2);
    expect(result.netIncome).toBeCloseTo(850000, 2);
  });

  it("handles large values with IOF and precision", () => {
    const result = calculateTax(1000000, 10);

    // IOF 69%: 1,000,000 * 0.69 = 690,000
    expect(result.iofAmount).toBeCloseTo(690000, 2);
    // Income after IOF: 310,000
    // IR 22.5%: 310,000 * 0.225 = 69,750
    expect(result.irAmount).toBeCloseTo(69750, 2);
    // Net: 310,000 - 69,750 = 240,250
    expect(result.netIncome).toBeCloseTo(240250, 2);
  });

  it("at boundary day 180 uses 22.5% IR", () => {
    const result = calculateTax(200, 180);
    expect(result.irRate).toBe(0.225);
    expect(result.iofRate).toBe(0);
    expect(result.irAmount).toBeCloseTo(45, 2);
    expect(result.netIncome).toBeCloseTo(155, 2);
  });

  it("at boundary day 360 uses 20% IR", () => {
    const result = calculateTax(200, 360);
    expect(result.irRate).toBe(0.20);
    expect(result.irAmount).toBeCloseTo(40, 2);
    expect(result.netIncome).toBeCloseTo(160, 2);
  });

  it("at boundary day 720 uses 17.5% IR", () => {
    const result = calculateTax(200, 720);
    expect(result.irRate).toBe(0.175);
    expect(result.irAmount).toBeCloseTo(35, 2);
    expect(result.netIncome).toBeCloseTo(165, 2);
  });
});
