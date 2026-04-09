"use client"

import Link from "next/link"
import { ArrowRight, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate, formatPercent } from "@/lib/format"
import type { SimulationListItem } from "@/types/simulation"

interface RecentSimulationsProps {
  simulations: SimulationListItem[]
}

export function RecentSimulations({ simulations }: RecentSimulationsProps) {
  if (simulations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="mb-4 text-muted-foreground">
            Voce ainda nao tem simulacoes
          </p>
          <Button render={<Link href="/simulations/new" />}>
            <PlusCircle className="mr-2 size-4" />
            Criar Simulacao
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Simulacoes Recentes</CardTitle>
          <CardDescription>Ultimas simulacoes realizadas</CardDescription>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/simulations" />}>
          Ver todas
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Valor Inicial</TableHead>
              <TableHead className="text-right">Periodo</TableHead>
              <TableHead className="text-right">Diferenca</TableHead>
              <TableHead className="text-right">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {simulations.map((sim) => (
              <TableRow key={sim.id}>
                <TableCell>
                  <Link
                    href={`/simulations/${sim.id}`}
                    className="font-medium hover:underline"
                  >
                    {sim.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sim.initialAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {sim.periodMonths} meses
                </TableCell>
                <TableCell className="text-right">
                  {formatPercent(Math.abs(sim.comparisonPctDiff))}
                </TableCell>
                <TableCell className="text-right">
                  {formatDate(sim.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
