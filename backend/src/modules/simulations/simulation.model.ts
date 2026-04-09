import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const simulations = sqliteTable("simulations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),

  initialAmount: real("initial_amount").notNull(),
  monthlyContribution: real("monthly_contribution").notNull(),
  periodMonths: integer("period_months").notNull(),
  fixedAnnualRate: real("fixed_annual_rate").notNull(),
  variableExpectedAnnualRate: real("variable_expected_annual_rate").notNull(),
  variableVolatility: real("variable_volatility").notNull(),

  fixedIncomeResult: text("fixed_income_result").notNull(),
  variableIncomeResult: text("variable_income_result").notNull(),
  taxSummary: text("tax_summary").notNull(),
  comparisonPctDiff: real("comparison_pct_diff").notNull(),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
