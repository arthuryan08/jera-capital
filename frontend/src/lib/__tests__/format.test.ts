import { describe, it, expect } from "vitest"
import {
  formatCurrency,
  formatPercent,
  formatDate,
  parseCurrencyInput,
} from "../format"

describe("formatCurrency", () => {
  it("formats positive values in BRL", () => {
    const result = formatCurrency(1234.56)
    expect(result).toContain("1.234,56")
    expect(result).toContain("R$")
  })

  it("formats zero", () => {
    const result = formatCurrency(0)
    expect(result).toContain("0,00")
  })

  it("formats negative values", () => {
    const result = formatCurrency(-500)
    expect(result).toContain("500,00")
  })

  it("formats large values correctly", () => {
    const result = formatCurrency(1000000.99)
    expect(result).toContain("1.000.000,99")
  })

  it("formats small decimal values", () => {
    const result = formatCurrency(0.01)
    expect(result).toContain("0,01")
  })

  it("rounds to 2 decimal places", () => {
    const result = formatCurrency(1234.567)
    expect(result).toContain("1.234,57")
  })
})

describe("formatPercent", () => {
  it("formats percentage from number (10 -> 10,00%)", () => {
    const result = formatPercent(10)
    expect(result).toContain("10,00%")
  })

  it("formats fractional percentages", () => {
    const result = formatPercent(0.5)
    expect(result).toContain("0,50%")
  })

  it("formats zero percent", () => {
    const result = formatPercent(0)
    expect(result).toContain("0,00%")
  })

  it("formats large percentages", () => {
    const result = formatPercent(100)
    expect(result).toContain("100,00%")
  })

  it("formats negative percentages", () => {
    const result = formatPercent(-5)
    expect(result).toContain("5,00%")
  })
})

describe("formatDate", () => {
  it("formats ISO date to pt-BR format", () => {
    const result = formatDate("2026-04-09T12:00:00.000Z")
    expect(result).toBe("09/04/2026")
  })

  it("formats another date correctly", () => {
    const result = formatDate("2025-12-25T12:00:00.000Z")
    expect(result).toBe("25/12/2025")
  })
})

describe("parseCurrencyInput", () => {
  it("parses R$ formatted string", () => {
    expect(parseCurrencyInput("R$ 1.234,56")).toBe(1234.56)
  })

  it("parses plain number string", () => {
    expect(parseCurrencyInput("1000")).toBe(1000)
  })

  it("returns 0 for empty string", () => {
    expect(parseCurrencyInput("")).toBe(0)
  })

  it("returns 0 for invalid input", () => {
    expect(parseCurrencyInput("abc")).toBe(0)
  })

  it("parses value with comma as decimal separator", () => {
    expect(parseCurrencyInput("500,50")).toBe(500.5)
  })

  it("parses value with R$ prefix without space", () => {
    expect(parseCurrencyInput("R$100,00")).toBe(100)
  })

  it("parses large values with thousand separators", () => {
    expect(parseCurrencyInput("R$ 1.000.000,00")).toBe(1000000)
  })
})
