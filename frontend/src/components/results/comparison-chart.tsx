"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartDataPoint } from "@/lib/chart-helpers"
import { formatCurrency } from "@/lib/format"

const chartConfig = {
  "Renda Fixa": {
    label: "Renda Fixa",
    color: "var(--chart-1)",
  },
  "Renda Variavel (Esperado)": {
    label: "RV Esperado",
    color: "var(--chart-2)",
  },
  "Renda Variavel (Superior)": {
    label: "RV Superior",
    color: "var(--chart-3)",
  },
  "Renda Variavel (Inferior)": {
    label: "RV Inferior",
    color: "var(--chart-4)",
  },
  "Total Investido": {
    label: "Total Investido",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

interface ComparisonChartProps {
  data: ChartDataPoint[]
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolucao Patrimonial</CardTitle>
        <CardDescription>
          Comparacao entre renda fixa e variavel ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}m`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrency(v)}
              width={100}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="Total Investido"
              stroke="var(--color-Total Investido)"
              strokeDasharray="5 5"
              dot={false}
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="Renda Fixa"
              stroke="var(--color-Renda Fixa)"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Renda Variavel (Esperado)"
              stroke="var(--color-Renda Variavel (Esperado))"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Renda Variavel (Superior)"
              stroke="var(--color-Renda Variavel (Superior))"
              dot={false}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="Renda Variavel (Inferior)"
              stroke="var(--color-Renda Variavel (Inferior))"
              dot={false}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
