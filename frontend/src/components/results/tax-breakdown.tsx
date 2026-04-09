"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatPercent } from "@/lib/format"
import type { TaxResult } from "@/types/simulation"

interface TaxBreakdownProps {
  fixedTax: TaxResult
  variableTax: TaxResult
}

export function TaxBreakdown({ fixedTax, variableTax }: TaxBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhamento Tributário</CardTitle>
        <CardDescription>
          IR e IOF aplicados sobre o rendimento bruto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imposto</TableHead>
              <TableHead className="text-right">Renda Fixa</TableHead>
              <TableHead className="text-right">Renda Variavel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Rendimento Bruto</TableCell>
              <TableCell className="text-right">
                {formatCurrency(fixedTax.grossIncome)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(variableTax.grossIncome)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                IOF ({formatPercent(fixedTax.iofRate * 100)})
              </TableCell>
              <TableCell className="text-right">
                -{formatCurrency(fixedTax.iofAmount)}
              </TableCell>
              <TableCell className="text-right">
                -{formatCurrency(variableTax.iofAmount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                IR ({formatPercent(fixedTax.irRate * 100)})
              </TableCell>
              <TableCell className="text-right">
                -{formatCurrency(fixedTax.irAmount)}
              </TableCell>
              <TableCell className="text-right">
                -{formatCurrency(variableTax.irAmount)}
              </TableCell>
            </TableRow>
            <TableRow className="font-semibold">
              <TableCell>Rendimento Líquido</TableCell>
              <TableCell className="text-right">
                {formatCurrency(fixedTax.netIncome)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(variableTax.netIncome)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
