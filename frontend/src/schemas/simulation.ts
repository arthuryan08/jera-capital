import { z } from "zod"

export const createSimulationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  initialAmount: z
    .number({ error: "Valor inicial é obrigatório" })
    .min(0, "Valor inicial deve ser maior ou igual a 0"),
  monthlyContribution: z
    .number({ error: "Aporte mensal é obrigatório" })
    .min(0, "Aporte mensal deve ser maior ou igual a 0"),
  periodMonths: z
    .number({ error: "Período é obrigatório" })
    .int("Período deve ser um número inteiro")
    .min(1, "Período mínimo de 1 mês")
    .max(600, "Período máximo de 600 meses"),
  fixedAnnualRate: z
    .number({ error: "Taxa anual é obrigatória" })
    .min(0, "Taxa deve ser maior ou igual a 0")
    .max(100, "Taxa deve ser menor ou igual a 100"),
  variableExpectedAnnualRate: z
    .number({ error: "Retorno esperado é obrigatório" })
    .min(-50, "Retorno deve ser maior ou igual a -50")
    .max(200, "Retorno deve ser menor ou igual a 200"),
  variableVolatility: z
    .number({ error: "Volatilidade é obrigatória" })
    .min(0, "Volatilidade deve ser maior ou igual a 0")
    .max(100, "Volatilidade deve ser menor ou igual a 100"),
})

export type CreateSimulationInput = z.infer<typeof createSimulationSchema>
