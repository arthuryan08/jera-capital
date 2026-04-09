"use client"

import { useState, useCallback } from "react"
import type { Control, FieldValues, Path } from "react-hook-form"
import { useController } from "react-hook-form"

function formatAsCurrency(value: number): string {
  if (isNaN(value) || value === 0) return ""
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function parseRawValue(raw: string): number {
  const cleaned = raw
    .replace(/R\$\s?/, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim()
  const value = parseFloat(cleaned)
  return isNaN(value) ? 0 : value
}

export function useCurrencyInput<T extends FieldValues>(
  control: Control<T>,
  name: Path<T>
) {
  const { field } = useController({ control, name })
  const [displayValue, setDisplayValue] = useState(
    field.value ? formatAsCurrency(field.value) : ""
  )

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      setDisplayValue(raw)
      const numeric = parseRawValue(raw)
      field.onChange(numeric)
    },
    [field]
  )

  const onBlur = useCallback(() => {
    const numeric = typeof field.value === "number" ? field.value : 0
    if (numeric > 0) {
      setDisplayValue(formatAsCurrency(numeric))
    } else {
      setDisplayValue("")
    }
    field.onBlur()
  }, [field])

  return {
    displayValue,
    onChange,
    onBlur,
  }
}
