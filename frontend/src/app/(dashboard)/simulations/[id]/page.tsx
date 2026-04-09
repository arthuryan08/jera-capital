import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { serverFetch } from "@/lib/api-client"
import { ResultsView } from "@/components/results/results-view"
import { DeleteSimulationButton } from "@/components/simulations/delete-simulation-button"
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
      <div className="flex items-start gap-4">
        <Link
          href="/simulations"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {simulation.name}
            </h1>
            <DeleteSimulationButton id={simulation.id} name={simulation.name} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Criada em {formatDate(simulation.createdAt)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">
              Inicial: {formatCurrency(simulation.initialAmount)}
            </Badge>
            <Badge variant="secondary">
              Aporte: {formatCurrency(simulation.monthlyContribution)}/mês
            </Badge>
            <Badge variant="secondary">
              {simulation.periodMonths} meses
            </Badge>
            <Badge variant="secondary">
              RF: {formatPercent(simulation.fixedAnnualRate * 100)}
            </Badge>
            <Badge variant="secondary">
              RV: {formatPercent(simulation.variableExpectedAnnualRate * 100)}
            </Badge>
          </div>
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
