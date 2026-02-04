#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

async function runMigration() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  console.log("📦 Connecting to Turso database...");

  const migrationSQL = readFileSync("drizzle/0001_claim_cards.sql", "utf-8");

  // Remove comments and split by semicolons, handling multi-line statements
  const cleanedSQL = migrationSQL
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  const statements = cleanedSQL
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`🔄 Executing ${statements.length} SQL statements...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview =
      stmt.length > 60 ? `${stmt.substring(0, 60)}...` : stmt.substring(0, 60);
    console.log(`  [${i + 1}/${statements.length}] ${preview}`);
    try {
      await client.execute(stmt);
      console.log(`  ✅ Success`);
    } catch (error: any) {
      if (
        error.message?.includes("already exists") ||
        error.message?.includes("duplicate")
      ) {
        console.log(`  ⚠️  Already exists, skipping`);
      } else {
        console.error(`  ❌ Error: ${error.message}`);
        console.error(`  Statement: ${stmt}`);
        throw error;
      }
    }
  }

  console.log("\n✅ Migration completed successfully!");

  client.close();
}

runMigration().catch((error) => {
  console.error("❌ Migration failed:", error);
  process.exit(1);
});
