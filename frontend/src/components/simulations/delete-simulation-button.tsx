"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { clientFetch } from "@/lib/api-client"
import { DeleteSimulationDialog } from "./delete-simulation-dialog"

interface DeleteSimulationButtonProps {
  id: string
  name: string
}

export function DeleteSimulationButton({ id, name }: DeleteSimulationButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await clientFetch(`/api/simulations/${id}`, { method: "DELETE" })
      toast.success("Simulação excluída com sucesso")
      router.push("/simulations")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir simulação")
    } finally {
      setIsDeleting(false)
      setShowDialog(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => setShowDialog(true)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4" />
        )}
      </Button>

      <DeleteSimulationDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        name={name}
      />
    </>
  )
}
