import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import path from "path";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error("TURSO_DATABASE_URL environment variable is required");
  }

  const url = process.env.TURSO_DATABASE_URL.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  const client = createClient({
    url,
    authToken,
  });

  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    const instance = getDb();
    return (instance as any)[prop];
  },
});
