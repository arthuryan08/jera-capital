"use client"

import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { SimulationCard } from "./simulation-card"
import type { SimulationListItem } from "@/types/simulation"

interface SimulationListProps {
  simulations: SimulationListItem[]
}

export function SimulationList({ simulations }: SimulationListProps) {
  if (simulations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
        <p className="mb-4 text-muted-foreground">
          Nenhuma simulação encontrada
        </p>
        <Link href="/simulations/new" className={buttonVariants()}>
          <PlusCircle className="mr-2 size-4" />
          Criar Simulação
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {simulations.map((sim) => (
        <SimulationCard key={sim.id} simulation={sim} />
      ))}
    </div>
  )
}
