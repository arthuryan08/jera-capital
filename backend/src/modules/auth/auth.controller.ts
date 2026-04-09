import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth.service.js";
import type { RegisterInput, LoginInput } from "./auth.schemas.js";

export class AuthController {
  private service: AuthService;

  constructor(private app: FastifyInstance) {
    this.service = new AuthService((app as any).db);
  }

  async register(request: FastifyRequest<{ Body: RegisterInput }>, reply: FastifyReply) {
    const user = await this.service.register(request.body);
    const token = this.app.jwt.sign(
      { sub: user.id, email: user.email },
      { expiresIn: "7d" }
    );
    return reply.status(201).send({ user, token });
  }

  async login(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
    const user = await this.service.login(request.body);
    const token = this.app.jwt.sign(
      { sub: user.id, email: user.email },
      { expiresIn: "7d" }
    );
    return reply.send({ user, token });
  }
}
