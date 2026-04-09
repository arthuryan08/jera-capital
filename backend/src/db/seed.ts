import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { users } from "../modules/auth/user.model.js";
import type { Database } from "./client.js";

export async function seedDatabase(db: Database) {
  const existing = await db
    .select()
    .from(users)
    .get();

  if (existing) return;

  const passwordHash = await bcrypt.hash("password123", 10);

  await db.insert(users).values({
    id: uuidv4(),
    name: "Admin",
    email: "admin@test.com",
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  console.log("Seed: default user created (admin@test.com / password123)");
}
