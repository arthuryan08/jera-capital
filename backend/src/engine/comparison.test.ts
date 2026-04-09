import { describe, it, expect } from "vitest";
import { calculatePercentageDiff } from "./comparison.js";

describe("calculatePercentageDiff", () => {
  it("returns positive when fixed is higher", () => {
    expect(calculatePercentageDiff(11000, 10500)).toBeCloseTo(4.76, 1);
  });

  it("returns negative when variable is higher", () => {
    expect(calculatePercentageDiff(10000, 11000)).toBeCloseTo(-9.09, 1);
  });

  it("returns 0 when both are equal", () => {
    expect(calculatePercentageDiff(10000, 10000)).toBe(0);
  });

  it("handles zero variable value", () => {
    expect(calculatePercentageDiff(10000, 0)).toBe(Infinity);
  });
});
