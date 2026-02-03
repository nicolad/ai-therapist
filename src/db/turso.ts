import { createClient } from "@libsql/client";

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "file:./therapeutic.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

export const turso = createClient({
  url,
  authToken,
});

/**
 * Initialize database schema
 * Creates all tables if they don't exist
 */
export async function initializeDatabase() {
  // Core app tables
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      family_member_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      target_date TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      priority TEXT NOT NULL DEFAULT 'medium',
      therapeutic_text TEXT,
      therapeutic_text_language TEXT,
      therapeutic_text_generated_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS therapy_research (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL,
      therapeutic_goal_type TEXT NOT NULL,
      title TEXT NOT NULL,
      authors TEXT NOT NULL,
      year INTEGER,
      journal TEXT,
      doi TEXT,
      url TEXT,
      abstract TEXT,
      key_findings TEXT NOT NULL,
      therapeutic_techniques TEXT NOT NULL,
      evidence_level TEXT,
      relevance_score REAL NOT NULL,
      extracted_by TEXT NOT NULL,
      extraction_confidence REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
    );
  `);

  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_research_goal ON therapy_research(goal_id);
  `);

  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_research_doi ON therapy_research(doi);
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS therapeutic_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      research_id INTEGER,
      research_title TEXT,
      rationale TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
      FOREIGN KEY (research_id) REFERENCES therapy_research(id) ON DELETE SET NULL
    );
  `);

  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_questions_goal ON therapeutic_questions(goal_id);
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_id INTEGER NOT NULL,
      entity_type TEXT NOT NULL,
      user_id TEXT NOT NULL,
      note_type TEXT,
      content TEXT NOT NULL,
      created_by TEXT,
      tags TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_notes_entity ON notes(entity_id, entity_type);
  `);

  // Generation jobs table
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS generation_jobs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      goal_id INTEGER NOT NULL,
      story_id INTEGER,
      status TEXT NOT NULL DEFAULT 'RUNNING',
      progress REAL NOT NULL DEFAULT 0,
      result_json TEXT,
      error_json TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
    );
  `);

  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_jobs_goal ON generation_jobs(goal_id);
  `);

  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_jobs_status ON generation_jobs(status);
  `);

  // Goal stories table
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS goal_stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL,
      language TEXT NOT NULL,
      minutes INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
    );
  `);

  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_stories_goal ON goal_stories(goal_id);
  `);

  // Text segments table
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS text_segments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL,
      story_id INTEGER,
      idx INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
      FOREIGN KEY (story_id) REFERENCES goal_stories(id) ON DELETE CASCADE
    );
  `);

  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_segments_story ON text_segments(story_id, idx);
  `);

  // Audio assets table
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS audio_assets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      goal_id INTEGER NOT NULL,
      story_id INTEGER,
      language TEXT NOT NULL,
      voice TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      manifest_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
      FOREIGN KEY (story_id) REFERENCES goal_stories(id) ON DELETE SET NULL
    );
  `);

  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_audio_assets_goal ON audio_assets(goal_id);
  `);

  // Audio segments table (BLOB storage)
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS audio_segments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_id TEXT NOT NULL,
      idx INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      bytes BLOB NOT NULL,
      sha256 TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(asset_id, idx),
      FOREIGN KEY (asset_id) REFERENCES audio_assets(id) ON DELETE CASCADE
    );
  `);

  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_audio_segments_asset ON audio_segments(asset_id, idx);
  `);

  console.log("✅ Database initialized");
}
