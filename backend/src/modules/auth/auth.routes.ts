import type { FastifyInstance } from "fastify";
import { registerSchema, loginSchema } from "./auth.schemas.js";
import { AuthController } from "./auth.controller.js";

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController(app);
  const rlMax = (app as any).rateLimitMax ?? 5;

  app.post(
    "/api/auth/register",
    {
      schema: {
        body: registerSchema,
        tags: ["Auth"],
      },
      config: { rateLimit: { max: rlMax, timeWindow: "1 minute" } },
    },
    (req, reply) => controller.register(req as any, reply)
  );

  app.post(
    "/api/auth/login",
    {
      schema: {
        body: loginSchema,
        tags: ["Auth"],
      },
      config: { rateLimit: { max: rlMax, timeWindow: "1 minute" } },
    },
    (req, reply) => controller.login(req as any, reply)
  );
}
