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

  it("handles mismatched lengths", () => {
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
})
