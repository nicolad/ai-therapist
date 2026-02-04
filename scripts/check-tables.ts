#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkTables() {
  console.log("🔍 Checking Turso database tables...\n");

  try {
    const result = await client.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`,
      args: [],
    });

    console.log(`Found ${result.rows.length} tables:`);
    for (const row of result.rows) {
      console.log(`  - ${row.name}`);
    }

    // Check specifically for claim_cards
    const claimCardsCheck = await client.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='claim_cards'`,
      args: [],
    });

    if (claimCardsCheck.rows.length === 0) {
      console.log("\n❌ claim_cards table does NOT exist");
    } else {
      console.log("\n✅ claim_cards table exists");

      // Check schema
      const schemaResult = await client.execute({
        sql: `PRAGMA table_info(claim_cards)`,
        args: [],
      });

      console.log("\n📋 claim_cards schema:");
      for (const col of schemaResult.rows) {
        console.log(`  - ${col.name}: ${col.type}`);
      }
    }

    // Check notes_claims table
    const notesClaimsCheck = await client.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='notes_claims'`,
      args: [],
    });

    if (notesClaimsCheck.rows.length === 0) {
      console.log("\n❌ notes_claims table does NOT exist");
    } else {
      console.log("\n✅ notes_claims table exists");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    client.close();
  }
}

checkTables();
