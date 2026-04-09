export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(dateString))
}

export function parseCurrencyInput(raw: string): number {
  const cleaned = raw
    .replace(/R\$\s?/, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim()
  const value = parseFloat(cleaned)
  return isNaN(value) ? 0 : value
}
