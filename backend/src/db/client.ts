import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

export function createDb(url: string) {
  return drizzle({ connection: { url }, schema });
}

export type Database = ReturnType<typeof createDb>;
