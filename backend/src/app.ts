import Fastify from "fastify";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { registerCors } from "./plugins/cors.js";
import { registerSwagger } from "./plugins/swagger.js";
import { registerErrorHandler } from "./plugins/error-handler.js";
import { registerAuth } from "./modules/auth/auth.plugin.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { simulationRoutes } from "./modules/simulations/simulation.routes.js";
import { createDb, type Database } from "./db/client.js";

declare module "fastify" {
  interface FastifyInstance {
    db: Database;
    rateLimitMax: number;
  }
}

export interface AppOptions {
  logger?: boolean;
  dbUrl?: string;
  db?: Database;
  jwtSecret?: string;
  corsOrigin?: string;
  rateLimitMax?: number;
}

export async function buildApp(options: AppOptions = {}) {
  const app = Fastify({ logger: options.logger ?? false });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  const db = options.db ?? createDb(options.dbUrl ?? "file:./data/jera.db");
  app.decorate("db", db);

  await registerCors(app, options.corsOrigin ?? "http://localhost:3000");
  await app.register(helmet, { global: true });
  await app.register(rateLimit, { global: false });
  app.decorate("rateLimitMax", options.rateLimitMax ?? 5);
  await registerSwagger(app);
  registerErrorHandler(app);
  await registerAuth(app, options.jwtSecret ?? "dev-secret");

  await app.register(authRoutes);
  await app.register(simulationRoutes);

  return app;
}
