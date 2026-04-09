import { serverFetch } from "@/lib/api-client"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { RecentSimulations } from "@/components/dashboard/recent-simulations"
import type { SimulationListItem } from "@/types/simulation"

interface ListResponse {
  data: SimulationListItem[]
  total: number
  page: number
  limit: number
}

export default async function DashboardPage() {
  let simulations: SimulationListItem[] = []
  let total = 0

  try {
    const res = await serverFetch<ListResponse>(
      "/api/simulations?page=1&limit=5"
    )
    simulations = res.data
    total = res.total
  } catch {
    // Will show empty state
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumo das suas simulacoes de investimento
        </p>
      </div>

      <SummaryCards total={total} simulations={simulations} />
      <RecentSimulations simulations={simulations} />
    </div>
  )
}
