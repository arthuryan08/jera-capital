"use client"

import { useState, useCallback } from "react"
import type { Control, FieldValues, Path } from "react-hook-form"
import { useController } from "react-hook-form"

function formatCents(cents: number): string {
  if (cents === 0) return ""
  const value = cents / 100
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function useCurrencyInput<T extends FieldValues>(
  control: Control<T>,
  name: Path<T>
) {
  const { field } = useController({ control, name })
  const [cents, setCents] = useState(() => {
    const initial = typeof field.value === "number" ? field.value : 0
    return Math.round(initial * 100)
  })

  const displayValue = formatCents(cents)

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault()

      if (e.key === "Backspace" || e.key === "Delete") {
        const next = Math.floor(cents / 10)
        setCents(next)
        field.onChange(next / 100)
        return
      }

      const digit = e.key
      if (!/^\d$/.test(digit)) return

      const next = cents * 10 + parseInt(digit, 10)
      if (next > 99999999999) return
      setCents(next)
      field.onChange(next / 100)
    },
    [cents, field]
  )

  const onChange = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>) => {
      // handled by onKeyDown
    },
    []
  )

  return {
    displayValue,
    onChange,
    onKeyDown,
    onBlur: field.onBlur,
  }
}
