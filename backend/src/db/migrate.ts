import { migrate } from "drizzle-orm/libsql/migrator";
import type { Database } from "./client.js";

export async function runMigrations(db: Database) {
  await migrate(db, { migrationsFolder: "./drizzle" });
}
