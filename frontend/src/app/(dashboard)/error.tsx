"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <h2 className="text-xl font-semibold">Algo deu errado</h2>
          <p className="text-center text-muted-foreground">
            {error.message || "Ocorreu um erro inesperado. Tente novamente."}
          </p>
          <Button onClick={reset}>Tentar novamente</Button>
        </CardContent>
      </Card>
    </div>
  )
}
