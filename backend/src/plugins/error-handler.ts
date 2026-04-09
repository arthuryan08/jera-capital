import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Validation Error",
        details: error.flatten().fieldErrors,
      });
    }

    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        error: error.message,
      });
    }

    app.log.error(error);
    return reply.status(500).send({
      error: "Internal Server Error",
    });
  });
}
