import { config } from "dotenv";
config();

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { notes } from "../src/db/schema";

const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url: url!, authToken: authToken! });
const db = drizzle(client);

async function checkNotes() {
  console.log("🔍 Checking notes in database...\n");

  const allNotes = await db.select().from(notes);

  console.log(`Found ${allNotes.length} notes:\n`);

  allNotes.forEach((note) => {
    console.log(`ID: ${note.id}`);
    console.log(`Title: ${note.title || "(no title)"}`);
    console.log(`Slug: ${note.slug || "(no slug)"}`);
    console.log(`Entity: ${note.entityType} #${note.entityId}`);
    console.log(`User: ${note.userId}`);
    console.log(`Created: ${note.createdAt}`);
    console.log(`Content preview: ${note.content.slice(0, 100)}...`);
    console.log("---");
  });
}

checkNotes()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
