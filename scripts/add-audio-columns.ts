import "dotenv/config";
import { turso } from "../src/db/turso";

async function applyMigration() {
  try {
    console.log("Applying migration: adding audio columns to stories table...");

    await turso.execute("ALTER TABLE `stories` ADD `audio_key` text");
    console.log("✓ Added audio_key column");

    await turso.execute("ALTER TABLE `stories` ADD `audio_url` text");
    console.log("✓ Added audio_url column");

    await turso.execute("ALTER TABLE `stories` ADD `audio_generated_at` text");
    console.log("✓ Added audio_generated_at column");

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
  process.exit(0);
}

applyMigration();
