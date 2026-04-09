import { z } from "zod";

export const createSimulationSchema = z.object({
  name: z.string().min(1).max(200),
  initialAmount: z.number().nonnegative(),
  monthlyContribution: z.number().nonnegative(),
  periodMonths: z.number().int().min(1).max(360),
  fixedAnnualRate: z.number().positive().max(1),
  variableExpectedAnnualRate: z.number().positive().max(1),
  variableVolatility: z.number().nonnegative().max(1),
});

export const calculatePreviewSchema = createSimulationSchema.omit({ name: true });

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const simulationParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CreateSimulationInput = z.infer<typeof createSimulationSchema>;
export type CalculatePreviewInput = z.infer<typeof calculatePreviewSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
