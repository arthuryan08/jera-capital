import type { FastifyInstance } from "fastify";
import {
  createSimulationSchema,
  calculatePreviewSchema,
  paginationQuerySchema,
  simulationParamsSchema,
} from "./simulation.schemas.js";
import { SimulationController } from "./simulation.controller.js";
import type { Database } from "../../db/client.js";

export async function simulationRoutes(app: FastifyInstance) {
  const db = (app as any).db as Database;
  const controller = new SimulationController(db);

  app.post(
    "/api/simulations",
    {
      preHandler: [app.authenticate],
      schema: {
        body: createSimulationSchema,
        tags: ["Simulations"],
        security: [{ bearerAuth: [] }],
      },
    },
    (req, reply) => controller.create(req as any, reply)
  );

  app.post(
    "/api/simulations/calculate",
    {
      preHandler: [app.authenticate],
      schema: {
        body: calculatePreviewSchema,
        tags: ["Simulations"],
        security: [{ bearerAuth: [] }],
      },
    },
    (req, reply) => controller.calculate(req as any, reply)
  );

  app.get(
    "/api/simulations",
    {
      preHandler: [app.authenticate],
      schema: {
        querystring: paginationQuerySchema,
        tags: ["Simulations"],
        security: [{ bearerAuth: [] }],
      },
    },
    (req, reply) => controller.list(req as any, reply)
  );

  app.get(
    "/api/simulations/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        params: simulationParamsSchema,
        tags: ["Simulations"],
        security: [{ bearerAuth: [] }],
      },
    },
    (req, reply) => controller.getById(req as any, reply)
  );

  app.delete(
    "/api/simulations/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        params: simulationParamsSchema,
        tags: ["Simulations"],
        security: [{ bearerAuth: [] }],
      },
    },
    (req, reply) => controller.delete(req as any, reply)
  );
}
