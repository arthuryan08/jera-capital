"use client"

import { ComparisonChart } from "./comparison-chart"
import { TaxBreakdown } from "./tax-breakdown"
import { ScenarioSummary } from "./scenario-summary"
import { mergeChartData } from "@/lib/chart-helpers"
import type { CalculationResult } from "@/types/simulation"

interface ResultsViewProps {
  result: CalculationResult
}

export function ResultsView({ result }: ResultsViewProps) {
  const chartData = mergeChartData(
    result.fixed.monthlyEvolution,
    result.variable.monthlyEvolution
  )

  return (
    <div className="min-w-0 space-y-6">
      <ScenarioSummary
        fixed={result.fixed}
        variable={result.variable}
        pctDiff={result.pctDiff}
      />

      <ComparisonChart data={chartData} />

      <TaxBreakdown
        fixedTax={result.fixed.taxResult}
        variableTax={result.variable.expectedTaxResult}
      />
    </div>
  )
}
