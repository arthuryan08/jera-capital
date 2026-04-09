import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { serverFetch } from "@/lib/api-client"
import { ResultsView } from "@/components/results/results-view"
import { formatCurrency, formatDate, formatPercent } from "@/lib/format"
import type { SimulationRecord } from "@/types/simulation"

interface SimulationDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function SimulationDetailPage({
  params,
}: SimulationDetailPageProps) {
  const { id } = await params
  let simulation: SimulationRecord

  try {
    simulation = await serverFetch<SimulationRecord>(
      `/api/simulations/${id}`
    )
  } catch {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link href="/simulations" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {simulation.name}
          </h1>
          <p className="text-muted-foreground">
            Criada em {formatDate(simulation.createdAt)} | Valor inicial:{" "}
            {formatCurrency(simulation.initialAmount)} | Aporte:{" "}
            {formatCurrency(simulation.monthlyContribution)}/mes |{" "}
            {simulation.periodMonths} meses | RF:{" "}
            {formatPercent(simulation.fixedAnnualRate * 100)} | RV:{" "}
            {formatPercent(simulation.variableExpectedAnnualRate * 100)}
          </p>
        </div>
      </div>

      <ResultsView
        result={{
          fixed: simulation.fixedIncomeResult,
          variable: simulation.variableIncomeResult,
          pctDiff: simulation.comparisonPctDiff,
        }}
      />
    </div>
  )
}
