import { createClient } from "@libsql/client";
import { z } from "zod";

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "file:./therapeutic.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const turso = createClient({
  url,
  authToken,
});

/**
 * Turso Tools for Mastra Workflows
 * Provides database operations for goals, research, questions, notes, and jobs
 */

// ============================================
// Goals
// ============================================

export async function getGoal(goalId: number, userId: string) {
  const result = await turso.execute({
    sql: `SELECT * FROM goals WHERE id = ? AND user_id = ?`,
    args: [goalId, userId],
  });

  if (result.rows.length === 0) {
    throw new Error(`Goal ${goalId} not found`);
  }

  const row = result.rows[0];
  return {
    id: row.id as number,
    familyMemberId: row.family_member_id as number,
    userId: row.user_id as string,
    title: row.title as string,
    description: (row.description as string) || null,
    targetDate: (row.target_date as string) || null,
    status: row.status as string,
    priority: row.priority as string,
    therapeuticText: (row.therapeutic_text as string) || null,
    therapeuticTextLanguage: (row.therapeutic_text_language as string) || null,
    therapeuticTextGeneratedAt:
      (row.therapeutic_text_generated_at as string) || null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function listGoals(
  userId: string,
  familyMemberId?: number,
  status?: string,
) {
  let sql = `SELECT * FROM goals WHERE user_id = ?`;
  const args: any[] = [userId];

  if (familyMemberId) {
    sql += ` AND family_member_id = ?`;
    args.push(familyMemberId);
  }

  if (status) {
    sql += ` AND status = ?`;
    args.push(status);
  }

  sql += ` ORDER BY created_at DESC`;

  const result = await turso.execute({ sql, args });
  return result.rows.map((row) => ({
    id: row.id as number,
    familyMemberId: row.family_member_id as number,
    userId: row.user_id as string,
    title: row.title as string,
    description: (row.description as string) || null,
    targetDate: (row.target_date as string) || null,
    status: row.status as string,
    priority: row.priority as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

// ============================================
// Therapy Research
// ============================================

export async function upsertTherapyResearch(
  goalId: number,
  userId: string,
  research: {
    therapeuticGoalType: string;
    title: string;
    authors: string[];
    year?: number | null;
    journal?: string | null;
    doi?: string | null;
    url?: string | null;
    abstract?: string | null;
    keyFindings: string[];
    therapeuticTechniques: string[];
    evidenceLevel?: string | null;
    relevanceScore: number;
    extractedBy: string;
    extractionConfidence: number;
  },
) {
  // Check if exists by DOI or title
  let existingId: number | null = null;

  if (research.doi) {
    const checkDoi = await turso.execute({
      sql: `SELECT id FROM therapy_research WHERE goal_id = ? AND doi = ?`,
      args: [goalId, research.doi],
    });
    if (checkDoi.rows.length > 0) {
      existingId = checkDoi.rows[0].id as number;
    }
  }

  if (!existingId) {
    const checkTitle = await turso.execute({
      sql: `SELECT id FROM therapy_research WHERE goal_id = ? AND title = ?`,
      args: [goalId, research.title],
    });
    if (checkTitle.rows.length > 0) {
      existingId = checkTitle.rows[0].id as number;
    }
  }

  const authorsJson = JSON.stringify(research.authors);
  const keyFindingsJson = JSON.stringify(research.keyFindings);
  const techniquesJson = JSON.stringify(research.therapeuticTechniques);

  if (existingId) {
    // Update existing
    await turso.execute({
      sql: `UPDATE therapy_research 
            SET therapeutic_goal_type = ?,
                authors = ?,
                year = ?,
                journal = ?,
                doi = ?,
                url = ?,
                abstract = ?,
                key_findings = ?,
                therapeutic_techniques = ?,
                evidence_level = ?,
                relevance_score = ?,
                extracted_by = ?,
                extraction_confidence = ?,
                updated_at = datetime('now')
            WHERE id = ?`,
      args: [
        research.therapeuticGoalType,
        authorsJson,
        research.year || null,
        research.journal || null,
        research.doi || null,
        research.url || null,
        research.abstract || null,
        keyFindingsJson,
        techniquesJson,
        research.evidenceLevel || null,
        research.relevanceScore,
        research.extractedBy,
        research.extractionConfidence,
        existingId,
      ],
    });
    return existingId;
  } else {
    // Insert new
    const result = await turso.execute({
      sql: `INSERT INTO therapy_research (
              goal_id, therapeutic_goal_type, title, authors, year, journal, doi, url,
              abstract, key_findings, therapeutic_techniques, evidence_level,
              relevance_score, extracted_by, extraction_confidence
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        goalId,
        research.therapeuticGoalType,
        research.title,
        authorsJson,
        research.year || null,
        research.journal || null,
        research.doi || null,
        research.url || null,
        research.abstract || null,
        keyFindingsJson,
        techniquesJson,
        research.evidenceLevel || null,
        research.relevanceScore,
        research.extractedBy,
        research.extractionConfidence,
      ],
    });
    return Number(result.lastInsertRowid);
  }
}

export async function listTherapyResearch(goalId: number) {
  const result = await turso.execute({
    sql: `SELECT * FROM therapy_research WHERE goal_id = ? ORDER BY relevance_score DESC, created_at DESC`,
    args: [goalId],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    goalId: row.goal_id as number,
    therapeuticGoalType: row.therapeutic_goal_type as string,
    title: row.title as string,
    authors: JSON.parse(row.authors as string) as string[],
    year: (row.year as number) || null,
    journal: (row.journal as string) || null,
    doi: (row.doi as string) || null,
    url: (row.url as string) || null,
    abstract: (row.abstract as string) || null,
    keyFindings: JSON.parse(row.key_findings as string) as string[],
    therapeuticTechniques: JSON.parse(
      row.therapeutic_techniques as string,
    ) as string[],
    evidenceLevel: (row.evidence_level as string) || null,
    relevanceScore: row.relevance_score as number,
    extractedBy: row.extracted_by as string,
    extractionConfidence: row.extraction_confidence as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

// ============================================
// Notes
// ============================================

export async function listNotesForEntity(
  entityId: number,
  entityType: string,
  userId: string,
) {
  const result = await turso.execute({
    sql: `SELECT * FROM notes WHERE entity_id = ? AND entity_type = ? AND user_id = ? ORDER BY created_at DESC`,
    args: [entityId, entityType, userId],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    entityId: row.entity_id as number,
    entityType: row.entity_type as string,
    userId: row.user_id as string,
    noteType: (row.note_type as string) || null,
    content: row.content as string,
    createdBy: (row.created_by as string) || null,
    tags: row.tags ? JSON.parse(row.tags as string) : [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

export async function createNote(params: {
  entityId: number;
  entityType: string;
  userId: string;
  content: string;
  noteType: string | null;
  createdBy: string | null;
  tags: string[];
}) {
  const tagsJson = JSON.stringify(params.tags);
  const result = await turso.execute({
    sql: `INSERT INTO notes (entity_id, entity_type, user_id, note_type, content, created_by, tags)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          RETURNING id`,
    args: [
      params.entityId,
      params.entityType,
      params.userId,
      params.noteType,
      params.content,
      params.createdBy,
      tagsJson,
    ],
  });

  return result.rows[0].id as number;
}

// ============================================
// Generation Jobs
// ============================================

export async function createGenerationJob(
  id: string,
  userId: string,
  type: "AUDIO" | "RESEARCH" | "QUESTIONS" | "LONGFORM",
  goalId: number,
  storyId?: number,
) {
  await turso.execute({
    sql: `INSERT INTO generation_jobs (id, user_id, type, goal_id, story_id, status, progress)
          VALUES (?, ?, ?, ?, ?, 'RUNNING', 0)`,
    args: [id, userId, type, goalId, storyId || null],
  });
}

export async function updateGenerationJob(
  id: string,
  updates: {
    status?: "RUNNING" | "SUCCEEDED" | "FAILED";
    progress?: number;
    result?: any;
    error?: any;
  },
) {
  const fields: string[] = [];
  const args: any[] = [];

  if (updates.status) {
    fields.push("status = ?");
    args.push(updates.status);
  }

  if (updates.progress !== undefined) {
    fields.push("progress = ?");
    args.push(updates.progress);
  }

  if (updates.result) {
    fields.push("result_json = ?");
    args.push(JSON.stringify(updates.result));
  }

  if (updates.error) {
    fields.push("error_json = ?");
    args.push(JSON.stringify(updates.error));
  }

  fields.push("updated_at = datetime('now')");
  args.push(id);

  await turso.execute({
    sql: `UPDATE generation_jobs SET ${fields.join(", ")} WHERE id = ?`,
    args,
  });
}

export async function getGenerationJob(id: string) {
  const result = await turso.execute({
    sql: `SELECT * FROM generation_jobs WHERE id = ?`,
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id as string,
    userId: row.user_id as string,
    type: row.type as string,
    goalId: row.goal_id as number,
    storyId: (row.story_id as number) || null,
    status: row.status as string,
    progress: row.progress as number,
    result: row.result_json ? JSON.parse(row.result_json as string) : null,
    error: row.error_json ? JSON.parse(row.error_json as string) : null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export const tursoTools = {
  getGoal,
  listGoals,
  upsertTherapyResearch,
  listTherapyResearch,
  listNotesForEntity,
  createNote,
  createGenerationJob,
  updateGenerationJob,
  getGenerationJob,
};
