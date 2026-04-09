import {
  calculateFixedIncome,
  calculateVariableIncome,
  calculatePercentageDiff,
} from "../../engine/index.js";
import { SimulationRepository, type SimulationInsert } from "./simulation.repository.js";
import type { CreateSimulationInput, CalculatePreviewInput } from "./simulation.schemas.js";

export class SimulationService {
  constructor(private repo: SimulationRepository) {}

  calculate(input: CalculatePreviewInput) {
    const fixed = calculateFixedIncome({
      initialAmount: input.initialAmount,
      monthlyContribution: input.monthlyContribution,
      periodMonths: input.periodMonths,
      annualRate: input.fixedAnnualRate,
    });

    const variable = calculateVariableIncome({
      initialAmount: input.initialAmount,
      monthlyContribution: input.monthlyContribution,
      periodMonths: input.periodMonths,
      expectedAnnualRate: input.variableExpectedAnnualRate,
      volatility: input.variableVolatility,
    });

    const pctDiff = calculatePercentageDiff(
      fixed.finalNetBalance,
      variable.finalExpected - (variable.finalExpected - variable.totalInvested) * variable.expectedTaxResult.irRate
    );

    return { fixed, variable, pctDiff };
  }

  async createSimulation(userId: string, input: CreateSimulationInput) {
    const result = this.calculate(input);

    const data: SimulationInsert = {
      userId,
      name: input.name,
      initialAmount: input.initialAmount,
      monthlyContribution: input.monthlyContribution,
      periodMonths: input.periodMonths,
      fixedAnnualRate: input.fixedAnnualRate,
      variableExpectedAnnualRate: input.variableExpectedAnnualRate,
      variableVolatility: input.variableVolatility,
      fixedIncomeResult: JSON.stringify(result.fixed),
      variableIncomeResult: JSON.stringify(result.variable),
      taxSummary: JSON.stringify({
        fixed: result.fixed.taxResult,
        variable: result.variable.expectedTaxResult,
      }),
      comparisonPctDiff: result.pctDiff,
    };

    return this.repo.create(data);
  }

  preview(input: CalculatePreviewInput) {
    return this.calculate(input);
  }

  async listSimulations(userId: string, page: number, limit: number) {
    return this.repo.findByUserId(userId, page, limit);
  }

  async getSimulation(userId: string, id: string) {
    const sim = await this.repo.findById(id, userId);
    if (!sim) {
      throw Object.assign(new Error("Simulation not found"), { statusCode: 404 });
    }
    return {
      ...sim,
      fixedIncomeResult: JSON.parse(sim.fixedIncomeResult),
      variableIncomeResult: JSON.parse(sim.variableIncomeResult),
      taxSummary: JSON.parse(sim.taxSummary),
    };
  }

  async deleteSimulation(userId: string, id: string) {
    const deleted = await this.repo.deleteById(id, userId);
    if (!deleted) {
      throw Object.assign(new Error("Simulation not found"), { statusCode: 404 });
    }
  }
}
