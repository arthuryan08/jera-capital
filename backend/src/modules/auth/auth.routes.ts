import type { FastifyInstance } from "fastify";
import { registerSchema, loginSchema } from "./auth.schemas.js";
import { AuthController } from "./auth.controller.js";

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController(app);

  app.post(
    "/api/auth/register",
    {
      schema: {
        body: registerSchema,
        tags: ["Auth"],
      },
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
    },
    (req, reply) => controller.login(req as any, reply)
  );
}
