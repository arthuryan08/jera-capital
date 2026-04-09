import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: unknown, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Validation Error",
        details: error.flatten().fieldErrors,
      });
    }

    const err = error as { statusCode?: number; message?: string };
    if (err.statusCode) {
      return reply.status(err.statusCode).send({
        error: err.message,
      });
    }

    app.log.error(error);
    return reply.status(500).send({
      error: "Internal Server Error",
    });
  });
}
