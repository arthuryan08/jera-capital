"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartDataPoint } from "@/lib/chart-helpers"
import { formatCurrency } from "@/lib/format"

const COLORS = {
  fixed: "hsl(221, 83%, 53%)",
  expected: "hsl(142, 71%, 45%)",
  upper: "hsl(142, 50%, 65%)",
  lower: "hsl(142, 50%, 65%)",
  invested: "hsl(220, 9%, 60%)",
}

const chartConfig = {
  "Renda Fixa": {
    label: "Renda Fixa",
    color: COLORS.fixed,
  },
  "Renda Variavel (Esperado)": {
    label: "RV Esperado",
    color: COLORS.expected,
  },
  "Renda Variavel (Superior)": {
    label: "RV Superior",
    color: COLORS.upper,
  },
  "Renda Variavel (Inferior)": {
    label: "RV Inferior",
    color: COLORS.lower,
  },
  "Total Investido": {
    label: "Total Investido",
    color: COLORS.invested,
  },
} satisfies ChartConfig

const SERIES_KEYS = [
  "Renda Fixa",
  "Renda Variavel (Esperado)",
  "Renda Variavel (Superior)",
  "Renda Variavel (Inferior)",
  "Total Investido",
] as const

interface ComparisonChartProps {
  data: ChartDataPoint[]
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number | [number, number]; color: string }>
  label?: number
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 font-medium">Mês {label}</p>
      <div className="grid gap-1">
        {payload
          .filter((entry) => SERIES_KEYS.includes(entry.dataKey as typeof SERIES_KEYS[number]))
          .map((entry) => {
            const config = chartConfig[entry.dataKey as keyof typeof chartConfig]
            const value = typeof entry.value === "number" ? entry.value : 0
            return (
              <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <div
                    className="size-2.5 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: config?.color ?? entry.color }}
                  />
                  <span className="text-muted-foreground">{config?.label ?? entry.dataKey}</span>
                </div>
                <span className="font-mono font-medium tabular-nums">
                  {formatCurrency(value)}
                </span>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    volatilityBand: [
      d["Renda Variavel (Inferior)"],
      d["Renda Variavel (Superior)"],
    ] as [number, number],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Patrimonial</CardTitle>
        <CardDescription>
          Comparação entre renda fixa e variável ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ComposedChart data={chartData}>
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
            <ChartTooltip content={<CustomTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="volatilityBand"
              fill={COLORS.expected}
              fillOpacity={0.1}
              stroke="none"
              legendType="none"
              tooltipType="none"
              isRange
            />
            <Line
              type="monotone"
              dataKey="Total Investido"
              stroke={COLORS.invested}
              strokeDasharray="3 3"
              dot={false}
              activeDot={{ r: 4 }}
              strokeWidth={1}
            />
            <Line
              type="monotone"
              dataKey="Renda Fixa"
              stroke={COLORS.fixed}
              dot={false}
              activeDot={{ r: 4 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Renda Variavel (Esperado)"
              stroke={COLORS.expected}
              dot={false}
              activeDot={{ r: 4 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Renda Variavel (Superior)"
              stroke={COLORS.upper}
              dot={false}
              activeDot={{ r: 4 }}
              strokeWidth={1}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="Renda Variavel (Inferior)"
              stroke={COLORS.lower}
              dot={false}
              activeDot={{ r: 4 }}
              strokeWidth={1}
              strokeDasharray="5 5"
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
