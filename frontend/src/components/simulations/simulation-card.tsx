"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate, formatPercent } from "@/lib/format"
import { clientFetch } from "@/lib/api-client"
import { DeleteSimulationDialog } from "./delete-simulation-dialog"
import type { SimulationListItem } from "@/types/simulation"

interface SimulationCardProps {
  simulation: SimulationListItem
}

export function SimulationCard({ simulation }: SimulationCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await clientFetch(`/api/simulations/${simulation.id}`, {
        method: "DELETE",
      })
      toast.success("Simulacao excluida com sucesso")
      router.refresh()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao excluir simulacao"
      )
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <Card className="group relative">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate">
                <Link
                  href={`/simulations/${simulation.id}`}
                  className="hover:underline"
                >
                  {simulation.name}
                </Link>
              </CardTitle>
              <CardDescription>{formatDate(simulation.createdAt)}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Valor inicial</span>
            <span>{formatCurrency(simulation.initialAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Aporte mensal</span>
            <span>{formatCurrency(simulation.monthlyContribution)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Periodo</span>
            <span>{simulation.periodMonths} meses</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">RF vs RV</span>
            <Badge variant={simulation.comparisonPctDiff > 0 ? "default" : "secondary"}>
              {formatPercent(Math.abs(simulation.comparisonPctDiff))}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <DeleteSimulationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        name={simulation.name}
      />
    </>
  )
}
