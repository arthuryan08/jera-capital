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

  it("returns 0% for day 30 and above", () => {
    expect(calculateIOFRate(30)).toBe(0);
    expect(calculateIOFRate(31)).toBe(0);
    expect(calculateIOFRate(365)).toBe(0);
  });
});

describe("calculateIRRate", () => {
  it("returns 22.5% for up to 180 days", () => {
    expect(calculateIRRate(1)).toBe(0.225);
    expect(calculateIRRate(180)).toBe(0.225);
  });

  it("returns 20% for 181 to 360 days", () => {
    expect(calculateIRRate(181)).toBe(0.20);
    expect(calculateIRRate(360)).toBe(0.20);
  });

  it("returns 17.5% for 361 to 720 days", () => {
    expect(calculateIRRate(361)).toBe(0.175);
    expect(calculateIRRate(720)).toBe(0.175);
  });

  it("returns 15% for above 720 days", () => {
    expect(calculateIRRate(721)).toBe(0.15);
    expect(calculateIRRate(1000)).toBe(0.15);
  });
});

describe("calculateTax", () => {
  it("matches the spec example: R$1000 invested, day 10, R$50 gross income", () => {
    const result = calculateTax(50, 10);

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

    expect(result.iofAmount).toBe(0);
    expect(result.irAmount).toBe(0);
    expect(result.netIncome).toBe(0);
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
});
