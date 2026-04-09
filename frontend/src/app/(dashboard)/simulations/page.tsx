import { serverFetch } from "@/lib/api-client"
import { SimulationList } from "@/components/simulations/simulation-list"
import type { SimulationListItem } from "@/types/simulation"

interface ListResponse {
  data: SimulationListItem[]
  total: number
  page: number
  limit: number
}

export default async function SimulationsPage() {
  let simulations: SimulationListItem[] = []
  let total = 0

  try {
    const res = await serverFetch<ListResponse>(
      "/api/simulations?page=1&limit=50"
    )
    simulations = res.data
    total = res.total
  } catch {
    // Will show empty state
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Histórico de Simulações
        </h1>
        <p className="text-muted-foreground">
          {total > 0
            ? `${total} simulação${total !== 1 ? "es" : ""} encontrada${total !== 1 ? "s" : ""}`
            : "Nenhuma simulação encontrada"}
        </p>
      </div>

      <SimulationList simulations={simulations} />
    </div>
  )
}
