import { describe, it, expect } from "vitest";
import { calculatePercentageDiff } from "./comparison.js";

describe("calculatePercentageDiff", () => {
  it("returns positive when fixed is higher (fixed > variable)", () => {
    // (11000 - 10500) / 10500 * 100 = 4.76%
    expect(calculatePercentageDiff(11000, 10500)).toBeCloseTo(4.76, 1);
  });

  it("returns negative when variable is higher (variable > fixed)", () => {
    // (10000 - 11000) / 11000 * 100 = -9.09%
    expect(calculatePercentageDiff(10000, 11000)).toBeCloseTo(-9.09, 1);
  });

  it("returns 0 when both are equal", () => {
    expect(calculatePercentageDiff(10000, 10000)).toBe(0);
  });

  it("handles zero variable value", () => {
    expect(calculatePercentageDiff(10000, 0)).toBe(Infinity);
  });

  it("calculates percentage correctly: ((fixed - variable) / variable) * 100", () => {
    // fixed=12000, variable=10000 => (2000/10000)*100 = 20%
    expect(calculatePercentageDiff(12000, 10000)).toBe(20);
  });

  it("handles small differences", () => {
    // (10001 - 10000) / 10000 * 100 = 0.01%
    expect(calculatePercentageDiff(10001, 10000)).toBeCloseTo(0.01, 2);
  });

  it("handles large differences", () => {
    // (50000 - 10000) / 10000 * 100 = 400%
    expect(calculatePercentageDiff(50000, 10000)).toBe(400);
  });

  it("handles both values being zero", () => {
    // 0 / 0 = Infinity (division by zero)
    expect(calculatePercentageDiff(0, 0)).toBe(Infinity);
  });
});
