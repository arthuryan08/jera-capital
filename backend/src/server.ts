import { buildApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { createDb } from "./db/client.js";
import { runMigrations } from "./db/migrate.js";
import { seedDatabase } from "./db/seed.js";

async function main() {
  const env = loadEnv();

  const db = createDb(`file:${env.DATABASE_URL}`);
  await runMigrations(db);
  await seedDatabase(db);

  const app = await buildApp({
    logger: true,
    db,
    jwtSecret: env.JWT_SECRET,
    corsOrigin: env.CORS_ORIGIN,
  });

  await app.listen({ port: env.PORT, host: "0.0.0.0" });
  console.log(`Server running at http://localhost:${env.PORT}`);
  console.log(`Swagger at http://localhost:${env.PORT}/documentation`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
