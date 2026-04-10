import { describe, it, expect } from "vitest"
import { mergeChartData } from "../chart-helpers"
import type { MonthlyDataPoint, VariableBand } from "@/types/simulation"

describe("mergeChartData", () => {
  it("merges fixed and variable data correctly", () => {
    const fixed: MonthlyDataPoint[] = [
      { month: 1, totalInvested: 1000, grossBalance: 1010, monthlyInterest: 10 },
      { month: 2, totalInvested: 1500, grossBalance: 1525, monthlyInterest: 15 },
    ]
    const variable: VariableBand[] = [
      { month: 1, expected: 1012, upper: 1015, lower: 1008, totalInvested: 1000 },
      { month: 2, expected: 1530, upper: 1540, lower: 1520, totalInvested: 1500 },
    ]

    const result = mergeChartData(fixed, variable)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      month: 1,
      "Renda Fixa": 1010,
      "Renda Variavel (Esperado)": 1012,
      "Renda Variavel (Superior)": 1015,
      "Renda Variavel (Inferior)": 1008,
      "Total Investido": 1000,
    })
  })

  it("handles empty arrays", () => {
    const result = mergeChartData([], [])
    expect(result).toEqual([])
  })

  it("handles mismatched lengths (more variable than fixed)", () => {
    const fixed: MonthlyDataPoint[] = [
      { month: 1, totalInvested: 1000, grossBalance: 1010, monthlyInterest: 10 },
    ]
    const variable: VariableBand[] = [
      { month: 1, expected: 1012, upper: 1015, lower: 1008, totalInvested: 1000 },
      { month: 2, expected: 1530, upper: 1540, lower: 1520, totalInvested: 1500 },
    ]

    const result = mergeChartData(fixed, variable)
    expect(result).toHaveLength(2)
    expect(result[1]["Renda Fixa"]).toBe(0)
    expect(result[1]["Renda Variavel (Esperado)"]).toBe(1530)
  })

  it("handles mismatched lengths (more fixed than variable)", () => {
    const fixed: MonthlyDataPoint[] = [
      { month: 1, totalInvested: 1000, grossBalance: 1010, monthlyInterest: 10 },
      { month: 2, totalInvested: 1500, grossBalance: 1525, monthlyInterest: 15 },
    ]
    const variable: VariableBand[] = [
      { month: 1, expected: 1012, upper: 1015, lower: 1008, totalInvested: 1000 },
    ]

    const result = mergeChartData(fixed, variable)
    expect(result).toHaveLength(2)
    expect(result[1]["Renda Variavel (Esperado)"]).toBe(0)
    expect(result[1]["Renda Fixa"]).toBe(1525)
  })

  it("includes Total Investido from fixed data", () => {
    const fixed: MonthlyDataPoint[] = [
      { month: 1, totalInvested: 5000, grossBalance: 5050, monthlyInterest: 50 },
    ]
    const variable: VariableBand[] = [
      { month: 1, expected: 5060, upper: 5070, lower: 5050, totalInvested: 5000 },
    ]

    const result = mergeChartData(fixed, variable)
    expect(result[0]["Total Investido"]).toBe(5000)
  })

  it("preserves month numbers from data", () => {
    const fixed: MonthlyDataPoint[] = [
      { month: 1, totalInvested: 1000, grossBalance: 1010, monthlyInterest: 10 },
      { month: 2, totalInvested: 1000, grossBalance: 1020, monthlyInterest: 10 },
      { month: 3, totalInvested: 1000, grossBalance: 1030, monthlyInterest: 10 },
    ]
    const variable: VariableBand[] = [
      { month: 1, expected: 1012, upper: 1015, lower: 1008, totalInvested: 1000 },
      { month: 2, expected: 1025, upper: 1030, lower: 1020, totalInvested: 1000 },
      { month: 3, expected: 1038, upper: 1045, lower: 1030, totalInvested: 1000 },
    ]

    const result = mergeChartData(fixed, variable)
    expect(result.map(d => d.month)).toEqual([1, 2, 3])
  })
})
