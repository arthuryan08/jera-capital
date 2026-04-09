import { eq, and, count, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { simulations } from "./simulation.model.js";
import type { Database } from "../../db/client.js";

export interface SimulationInsert {
  userId: string;
  name: string;
  initialAmount: number;
  monthlyContribution: number;
  periodMonths: number;
  fixedAnnualRate: number;
  variableExpectedAnnualRate: number;
  variableVolatility: number;
  fixedIncomeResult: string;
  variableIncomeResult: string;
  taxSummary: string;
  comparisonPctDiff: number;
}

export class SimulationRepository {
  constructor(private db: Database) {}

  async create(data: SimulationInsert) {
    const id = uuidv4();
    const now = new Date().toISOString();

    await this.db.insert(simulations).values({
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    return this.findById(id, data.userId);
  }

  async findByUserId(userId: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.db
        .select()
        .from(simulations)
        .where(eq(simulations.userId, userId))
        .orderBy(desc(simulations.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ count: count() })
        .from(simulations)
        .where(eq(simulations.userId, userId))
        .get(),
    ]);

    return { data, total: total?.count ?? 0, page, limit };
  }

  async findById(id: string, userId: string) {
    return this.db
      .select()
      .from(simulations)
      .where(and(eq(simulations.id, id), eq(simulations.userId, userId)))
      .get();
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const result = await this.db
      .delete(simulations)
      .where(and(eq(simulations.id, id), eq(simulations.userId, userId)));

    return (result as any).rowsAffected > 0;
  }
}
