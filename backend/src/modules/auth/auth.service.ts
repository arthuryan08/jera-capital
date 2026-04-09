import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { users } from "./user.model.js";
import type { Database } from "../../db/client.js";
import type { RegisterInput, LoginInput } from "./auth.schemas.js";

export class AuthService {
  constructor(private db: Database) {}

  async register(input: RegisterInput) {
    const existing = await this.db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .get();

    if (existing) {
      throw Object.assign(new Error("Email already registered"), { statusCode: 409 });
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const id = uuidv4();
    const now = new Date().toISOString();

    await this.db.insert(users).values({
      id,
      name: input.name,
      email: input.email,
      passwordHash,
      createdAt: now,
    });

    return { id, name: input.name, email: input.email };
  }

  async login(input: LoginInput) {
    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .get();

    if (!user) {
      throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
    }

    return { id: user.id, name: user.name, email: user.email };
  }
}
