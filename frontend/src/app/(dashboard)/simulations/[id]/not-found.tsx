import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SimulationNotFound() {
  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <h2 className="text-xl font-semibold">Simulacao nao encontrada</h2>
          <p className="text-center text-muted-foreground">
            A simulacao que voce procura nao existe ou foi excluida.
          </p>
          <Button render={<Link href="/simulations" />}>
            Voltar ao historico
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
