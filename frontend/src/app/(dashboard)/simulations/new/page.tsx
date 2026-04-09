"use client"

import { useState } from "react"
import { SimulationForm } from "@/components/simulations/simulation-form"
import { ResultsView } from "@/components/results/results-view"
import type { CalculationResult, } from "@/types/simulation"
import type { CreateSimulationInput } from "@/schemas/simulation"

export default function NewSimulationPage() {
  const [result, setResult] = useState<CalculationResult | null>(null)

  function handleResult(calcResult: CalculationResult, _input: CreateSimulationInput) {
    setResult(calcResult)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nova Simulacao</h1>
        <p className="text-muted-foreground">
          Compare investimentos em renda fixa e variavel
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <SimulationForm onResult={handleResult} />
        <div>
          {result ? (
            <ResultsView result={result} />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed">
              <p className="text-muted-foreground">
                Preencha o formulario e clique em Calcular para ver os resultados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
