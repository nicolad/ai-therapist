import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const goals = sqliteTable("goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  familyMemberId: integer("family_member_id").notNull(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  targetDate: text("target_date"),
  status: text("status").notNull().default("active"),
  priority: text("priority").notNull().default("medium"),
  therapeuticText: text("therapeutic_text"),
  therapeuticTextLanguage: text("therapeutic_text_language"),
  therapeuticTextGeneratedAt: text("therapeutic_text_generated_at"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const therapyResearch = sqliteTable("therapy_research", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  goalId: integer("goal_id").notNull(),
  therapeuticGoalType: text("therapeutic_goal_type").notNull(),
  title: text("title").notNull(),
  authors: text("authors").notNull(), // JSON array
  year: integer("year"),
  journal: text("journal"),
  doi: text("doi"),
  url: text("url"),
  abstract: text("abstract"),
  keyFindings: text("key_findings").notNull(), // JSON array
  therapeuticTechniques: text("therapeutic_techniques").notNull(), // JSON array
  evidenceLevel: text("evidence_level"),
  relevanceScore: integer("relevance_score").notNull(),
  extractedBy: text("extracted_by").notNull(),
  extractionConfidence: integer("extraction_confidence").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const therapeuticQuestions = sqliteTable("therapeutic_questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  goalId: integer("goal_id").notNull(),
  question: text("question").notNull(),
  researchId: integer("research_id"),
  researchTitle: text("research_title"),
  rationale: text("rationale").notNull(),
  generatedAt: text("generated_at").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityId: integer("entity_id").notNull(),
  entityType: text("entity_type").notNull(),
  userId: text("user_id").notNull(),
  noteType: text("note_type"),
  slug: text("slug").unique(),
  content: text("content").notNull(),
  createdBy: text("created_by"),
  tags: text("tags"), // JSON array
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const goalStories = sqliteTable("goal_stories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  goalId: integer("goal_id").notNull(),
  language: text("language").notNull(),
  minutes: integer("minutes").notNull(),
  text: text("text").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const textSegments = sqliteTable("text_segments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  goalId: integer("goal_id").notNull(),
  storyId: integer("story_id"),
  idx: integer("idx").notNull(),
  text: text("text").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const generationJobs = sqliteTable("generation_jobs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // AUDIO, RESEARCH, QUESTIONS, LONGFORM
  goalId: integer("goal_id").notNull(),
  storyId: integer("story_id"),
  status: text("status").notNull(), // RUNNING, SUCCEEDED, FAILED
  progress: integer("progress").notNull().default(0),
  result: text("result"), // JSON object
  error: text("error"), // JSON object
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const audioAssets = sqliteTable("audio_assets", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  goalId: integer("goal_id").notNull(),
  storyId: integer("story_id"),
  language: text("language").notNull(),
  voice: text("voice").notNull(),
  mimeType: text("mime_type").notNull(),
  manifest: text("manifest").notNull(), // JSON object
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const notesResearch = sqliteTable("notes_research", {
  noteId: integer("note_id").notNull(),
  researchId: integer("research_id").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
