import type { FastifyRequest, FastifyReply } from "fastify";
import { SimulationService } from "./simulation.service.js";
import { SimulationRepository } from "./simulation.repository.js";
import type { Database } from "../../db/client.js";
import type {
  CreateSimulationInput,
  CalculatePreviewInput,
  PaginationQuery,
} from "./simulation.schemas.js";

export class SimulationController {
  private service: SimulationService;

  constructor(db: Database) {
    this.service = new SimulationService(new SimulationRepository(db));
  }

  async create(
    request: FastifyRequest<{ Body: CreateSimulationInput }>,
    reply: FastifyReply
  ) {
    const result = await this.service.createSimulation(
      request.user.sub,
      request.body
    );
    return reply.status(201).send(result);
  }

  async calculate(
    request: FastifyRequest<{ Body: CalculatePreviewInput }>,
    reply: FastifyReply
  ) {
    const result = this.service.preview(request.body);
    return reply.send(result);
  }

  async list(
    request: FastifyRequest<{ Querystring: PaginationQuery }>,
    reply: FastifyReply
  ) {
    const { page, limit } = request.query;
    const result = await this.service.listSimulations(
      request.user.sub,
      page,
      limit
    );
    return reply.send(result);
  }

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const result = await this.service.getSimulation(
      request.user.sub,
      request.params.id
    );
    return reply.send(result);
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    await this.service.deleteSimulation(
      request.user.sub,
      request.params.id
    );
    return reply.status(204).send();
  }
}
