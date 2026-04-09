import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SimulationNotFound() {
  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <h2 className="text-xl font-semibold">Simulação não encontrada</h2>
          <p className="text-center text-muted-foreground">
            A simulação que você procura não existe ou foi excluída.
          </p>
          <Link href="/simulations" className={buttonVariants()}>
            Voltar ao histórico
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
