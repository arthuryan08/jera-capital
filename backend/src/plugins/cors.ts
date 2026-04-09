import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

export async function registerCors(app: FastifyInstance, origin: string) {
  await app.register(cors, { origin, credentials: true });
}
