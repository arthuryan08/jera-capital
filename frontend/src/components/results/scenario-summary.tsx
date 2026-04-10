"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatPercent } from "@/lib/format"
import type { FixedIncomeResult, VariableIncomeResult } from "@/types/simulation"

interface ScenarioSummaryProps {
  fixed: FixedIncomeResult
  variable: VariableIncomeResult
  pctDiff: number
}

export function ScenarioSummary({
  fixed,
  variable,
  pctDiff,
}: ScenarioSummaryProps) {
  const fixedWins = pctDiff > 0

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="min-w-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Renda Fixa</CardTitle>
            {fixedWins && (
              <Badge variant="default">Melhor opção</Badge>
            )}
          </div>
          <CardDescription>Resultado líquido após impostos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Investido</span>
            <span className="font-medium">
              {formatCurrency(fixed.totalInvested)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Saldo Bruto</span>
            <span className="font-medium">
              {formatCurrency(fixed.finalGrossBalance)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rendimento Bruto</span>
            <span className="font-medium">
              {formatCurrency(fixed.grossIncome)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="font-semibold">Saldo Líquido</span>
            <span className="font-bold text-primary">
              {formatCurrency(fixed.finalNetBalance)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Renda Variavel</CardTitle>
            {!fixedWins && (
              <Badge variant="default">Melhor opção</Badge>
            )}
          </div>
          <CardDescription>Cenário esperado com faixa de volatilidade</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Investido</span>
            <span className="font-medium">
              {formatCurrency(variable.totalInvested)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Saldo Esperado</span>
            <span className="font-medium">
              {formatCurrency(variable.finalExpected)}
            </span>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <span className="text-muted-foreground">Faixa</span>
            <span className="text-right text-sm font-medium">
              {formatCurrency(variable.finalLower)} ~ {formatCurrency(variable.finalUpper)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="font-semibold">Rendimento Esperado</span>
            <span className="font-bold text-primary">
              {formatCurrency(variable.finalExpected - variable.totalInvested)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="flex items-center justify-center py-6">
          <p className="text-center text-lg">
            {fixedWins ? "Renda Fixa" : "Renda Variavel"} rende{" "}
            <span className="font-bold text-primary">
              {formatPercent(Math.abs(pctDiff))}
            </span>{" "}
            a mais neste cenario
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
