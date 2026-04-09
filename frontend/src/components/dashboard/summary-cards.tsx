"use client"

import { Calculator, TrendingUp, History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import type { SimulationListItem } from "@/types/simulation"

interface SummaryCardsProps {
  total: number
  simulations: SimulationListItem[]
}

export function SummaryCards({ total, simulations }: SummaryCardsProps) {
  const avgInvestment =
    simulations.length > 0
      ? simulations.reduce((sum, s) => sum + s.initialAmount, 0) /
        simulations.length
      : 0

  const latestSimulation = simulations[0]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Simulacoes
          </CardTitle>
          <Calculator className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Investimento Medio
          </CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(avgInvestment)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ultima Simulacao
          </CardTitle>
          <History className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {latestSimulation?.name || "Nenhuma"}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
