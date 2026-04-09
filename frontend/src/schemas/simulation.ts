import { z } from "zod"

export const createSimulationSchema = z.object({
  name: z.string().min(1, "Nome e obrigatorio"),
  initialAmount: z
    .number({ error: "Valor inicial e obrigatorio" })
    .min(0, "Valor inicial deve ser maior ou igual a 0"),
  monthlyContribution: z
    .number({ error: "Aporte mensal e obrigatorio" })
    .min(0, "Aporte mensal deve ser maior ou igual a 0"),
  periodMonths: z
    .number({ error: "Periodo e obrigatorio" })
    .int("Periodo deve ser um numero inteiro")
    .min(1, "Periodo minimo de 1 mes")
    .max(600, "Periodo maximo de 600 meses"),
  fixedAnnualRate: z
    .number({ error: "Taxa anual e obrigatoria" })
    .min(0, "Taxa deve ser maior ou igual a 0")
    .max(100, "Taxa deve ser menor ou igual a 100"),
  variableExpectedAnnualRate: z
    .number({ error: "Retorno esperado e obrigatorio" })
    .min(-50, "Retorno deve ser maior ou igual a -50")
    .max(200, "Retorno deve ser menor ou igual a 200"),
  variableVolatility: z
    .number({ error: "Volatilidade e obrigatoria" })
    .min(0, "Volatilidade deve ser maior ou igual a 0")
    .max(100, "Volatilidade deve ser menor ou igual a 100"),
})

export type CreateSimulationInput = z.infer<typeof createSimulationSchema>
