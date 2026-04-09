export interface MonthlyDataPoint {
  month: number
  totalInvested: number
  grossBalance: number
  monthlyInterest: number
}

export interface VariableBand {
  month: number
  expected: number
  upper: number
  lower: number
  totalInvested: number
}

export interface TaxResult {
  grossIncome: number
  iofRate: number
  iofAmount: number
  irRate: number
  irAmount: number
  netIncome: number
}

export interface FixedIncomeResult {
  monthlyEvolution: MonthlyDataPoint[]
  finalGrossBalance: number
  finalNetBalance: number
  totalInvested: number
  grossIncome: number
  taxResult: TaxResult
}

export interface VariableIncomeResult {
  monthlyEvolution: VariableBand[]
  finalExpected: number
  finalUpper: number
  finalLower: number
  totalInvested: number
  expectedTaxResult: TaxResult
}

export interface CalculationResult {
  fixed: FixedIncomeResult
  variable: VariableIncomeResult
  pctDiff: number
}

export interface SimulationRecord {
  id: string
  userId: string
  name: string
  initialAmount: number
  monthlyContribution: number
  periodMonths: number
  fixedAnnualRate: number
  variableExpectedAnnualRate: number
  variableVolatility: number
  fixedIncomeResult: FixedIncomeResult
  variableIncomeResult: VariableIncomeResult
  taxSummary: {
    fixed: TaxResult
    variable: TaxResult
  }
  comparisonPctDiff: number
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
  comparisonPctDiff: number
  createdAt: string
}
