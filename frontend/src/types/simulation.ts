export interface MonthlyDataPoint {
  month: number
  balance: number
  invested: number
  earnings: number
}

export interface VariableBand {
  month: number
  expected: number
  upper: number
  lower: number
  invested: number
}

export interface TaxResult {
  grossAmount: number
  netAmount: number
  taxRate: number
  taxAmount: number
  months: number
}

export interface FixedIncomeResult {
  finalBalance: number
  totalInvested: number
  totalEarnings: number
  monthlyData: MonthlyDataPoint[]
  tax: TaxResult
}

export interface VariableIncomeResult {
  expectedFinalBalance: number
  upperBoundFinalBalance: number
  lowerBoundFinalBalance: number
  totalInvested: number
  bands: VariableBand[]
}

export interface SimulationResult {
  id: string
  name: string
  initialAmount: number
  monthlyContribution: number
  periodMonths: number
  fixedAnnualRate: number
  variableExpectedAnnualRate: number
  variableVolatility: number
  fixedIncome: FixedIncomeResult
  variableIncome: VariableIncomeResult
  createdAt: string
  updatedAt: string
}

export interface SimulationListItem {
  id: string
  name: string
  initialAmount: number
  monthlyContribution: number
  periodMonths: number
  fixedAnnualRate: number
  variableExpectedAnnualRate: number
  variableVolatility: number
  createdAt: string
}

export interface CalculationPreview {
  fixedIncome: FixedIncomeResult
  variableIncome: VariableIncomeResult
}
