import type { MonthlyDataPoint, VariableBand } from "@/types/simulation"

export interface ChartDataPoint {
  month: number
  "Renda Fixa": number
  "Renda Variavel (Esperado)": number
  "Renda Variavel (Superior)": number
  "Renda Variavel (Inferior)": number
  "Total Investido": number
}

export function mergeChartData(
  fixed: MonthlyDataPoint[],
  variable: VariableBand[]
): ChartDataPoint[] {
  const maxLength = Math.max(fixed.length, variable.length)
  const result: ChartDataPoint[] = []

  for (let i = 0; i < maxLength; i++) {
    const fixedPoint = fixed[i]
    const variablePoint = variable[i]

    result.push({
      month: fixedPoint?.month ?? variablePoint?.month ?? i + 1,
      "Renda Fixa": fixedPoint?.grossBalance ?? 0,
      "Renda Variavel (Esperado)": variablePoint?.expected ?? 0,
      "Renda Variavel (Superior)": variablePoint?.upper ?? 0,
      "Renda Variavel (Inferior)": variablePoint?.lower ?? 0,
      "Total Investido": fixedPoint?.totalInvested ?? variablePoint?.totalInvested ?? 0,
    })
  }

  return result
}
