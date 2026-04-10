"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCurrencyInput } from "@/hooks/use-currency-input"
import {
  createSimulationSchema,
  type CreateSimulationInput,
} from "@/schemas/simulation"
import { clientFetch } from "@/lib/api-client"
import type { CalculationResult } from "@/types/simulation"

interface SimulationFormProps {
  onResult?: (result: CalculationResult, input: CreateSimulationInput) => void
}

export function SimulationForm({ onResult }: SimulationFormProps) {
  const router = useRouter()
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<CreateSimulationInput>({
    resolver: zodResolver(createSimulationSchema),
    defaultValues: {
      name: "",
      initialAmount: 0,
      monthlyContribution: 0,
      periodMonths: 12,
      fixedAnnualRate: 10,
      variableExpectedAnnualRate: 15,
      variableVolatility: 5,
    },
  })

  const initialAmountInput = useCurrencyInput(control, "initialAmount")
  const monthlyInput = useCurrencyInput(control, "monthlyContribution")

  function toBackendRates(data: CreateSimulationInput) {
    return {
      ...data,
      fixedAnnualRate: data.fixedAnnualRate / 100,
      variableExpectedAnnualRate: data.variableExpectedAnnualRate / 100,
      variableVolatility: data.variableVolatility / 100,
    }
  }

  async function onCalculate(data: CreateSimulationInput) {
    setIsCalculating(true)
    try {
      const payload = toBackendRates(data)
      const { name: _, ...previewPayload } = payload
      const result = await clientFetch<CalculationResult>(
        "/api/simulations/calculate",
        { method: "POST", body: JSON.stringify(previewPayload) }
      )
      onResult?.(result, data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao calcular simulação")
    } finally {
      setIsCalculating(false)
    }
  }

  async function onSave(data: CreateSimulationInput) {
    setIsSaving(true)
    try {
      const payload = toBackendRates(data)
      await clientFetch("/api/simulations", {
        method: "POST",
        body: JSON.stringify(payload),
      })
      toast.success("Simulação salva com sucesso!")
      router.push("/simulations")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar simulação")
    } finally {
      setIsSaving(false)
    }
  }

  const isLoading = isCalculating || isSaving

  return (
    <form className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados da Simulação</CardTitle>
          <CardDescription>
            Preencha os parâmetros para comparar renda fixa e variável
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da simulação</Label>
            <Input
              id="name"
              placeholder="Ex: Aposentadoria 2030"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="initialAmount">Valor inicial</Label>
              <Input
                id="initialAmount"
                placeholder="R$ 0,00"
                value={initialAmountInput.displayValue}
                onChange={initialAmountInput.onChange}
                onKeyDown={initialAmountInput.onKeyDown}
                onBlur={initialAmountInput.onBlur}
              />
              {errors.initialAmount && (
                <p className="text-sm text-destructive">
                  {errors.initialAmount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyContribution">Aporte mensal</Label>
              <Input
                id="monthlyContribution"
                placeholder="R$ 0,00"
                value={monthlyInput.displayValue}
                onChange={monthlyInput.onChange}
                onKeyDown={monthlyInput.onKeyDown}
                onBlur={monthlyInput.onBlur}
              />
              {errors.monthlyContribution && (
                <p className="text-sm text-destructive">
                  {errors.monthlyContribution.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodMonths">Período (meses)</Label>
            <Input
              id="periodMonths"
              type="number"
              min={1}
              max={600}
              {...register("periodMonths", { valueAsNumber: true })}
            />
            {errors.periodMonths && (
              <p className="text-sm text-destructive">
                {errors.periodMonths.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Renda Fixa</CardTitle>
          <CardDescription>Taxa anual de rendimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="fixedAnnualRate">Taxa anual (%)</Label>
            <Input
              id="fixedAnnualRate"
              type="number"
              step="0.01"
              min={0}
              max={100}
              {...register("fixedAnnualRate", { valueAsNumber: true })}
            />
            {errors.fixedAnnualRate && (
              <p className="text-sm text-destructive">
                {errors.fixedAnnualRate.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Renda Variavel</CardTitle>
          <CardDescription>
            Retorno esperado e faixa de volatilidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="variableExpectedAnnualRate">
                Retorno esperado anual (%)
              </Label>
              <Input
                id="variableExpectedAnnualRate"
                type="number"
                step="0.01"
                min={0}
                max={200}
                {...register("variableExpectedAnnualRate", {
                  valueAsNumber: true,
                })}
              />
              {errors.variableExpectedAnnualRate && (
                <p className="text-sm text-destructive">
                  {errors.variableExpectedAnnualRate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="variableVolatility">Volatilidade (%)</Label>
              <Input
                id="variableVolatility"
                type="number"
                step="0.01"
                min={0}
                max={100}
                {...register("variableVolatility", { valueAsNumber: true })}
              />
              {errors.variableVolatility && (
                <p className="text-sm text-destructive">
                  {errors.variableVolatility.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={handleSubmit(onCalculate)}
          disabled={isLoading}
        >
          {isCalculating && <Loader2 className="mr-2 size-4 animate-spin" />}
          Calcular
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSubmit(onSave)}
          disabled={isLoading}
        >
          {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
          Salvar Simulação
        </Button>
      </div>
    </form>
  )
}
