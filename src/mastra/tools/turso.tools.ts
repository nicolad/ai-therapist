import { createClient } from "@libsql/client";
import { z } from "zod";
import path from "path";

let tursoClient: ReturnType<typeof createClient> | null = null;

function getTurso() {
  if (tursoClient) {
    return tursoClient;
  }

  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error("TURSO_DATABASE_URL environment variable is required");
  }

  const url = process.env.TURSO_DATABASE_URL.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  tursoClient = createClient({
    url,
    authToken,
  });

  return tursoClient;
}

const turso = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const instance = getTurso();
    return (instance as any)[prop];
  },
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

export async function createGoal(params: {
  familyMemberId: number;
  userId: string;
  title: string;
  description?: string | null;
  targetDate?: string | null;
  priority?: string;
}) {
  const priority = params.priority || "medium";
  const status = "active";

  const result = await turso.execute({
    sql: `INSERT INTO goals (family_member_id, user_id, title, description, target_date, status, priority)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          RETURNING id`,
    args: [
      params.familyMemberId,
      params.userId,
      params.title,
      params.description || null,
      params.targetDate || null,
      status,
      priority,
    ],
  });

  return result.rows[0].id as number;
}

export async function updateGoal(
  goalId: number,
  userId: string,
  updates: {
    title?: string;
    description?: string | null;
    targetDate?: string | null;
    status?: string;
    priority?: string;
  },
) {
  const fields: string[] = [];
  const args: any[] = [];

  if (updates.title !== undefined) {
    fields.push("title = ?");
    args.push(updates.title);
  }

  if (updates.description !== undefined) {
    fields.push("description = ?");
    args.push(updates.description);
  }

  if (updates.targetDate !== undefined) {
    fields.push("target_date = ?");
    args.push(updates.targetDate);
  }

  if (updates.status !== undefined) {
    fields.push("status = ?");
    args.push(updates.status);
  }

  if (updates.priority !== undefined) {
    fields.push("priority = ?");
    args.push(updates.priority);
  }

  fields.push("updated_at = datetime('now')");
  args.push(goalId, userId);

  await turso.execute({
    sql: `UPDATE goals SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
    args,
  });
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

export async function getResearchForNote(noteId: number) {
  const result = await turso.execute({
    sql: `SELECT tr.* FROM therapy_research tr
          INNER JOIN notes_research nr ON tr.id = nr.research_id
          WHERE nr.note_id = ?
          ORDER BY tr.relevance_score DESC, tr.created_at DESC`,
    args: [noteId],
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

export async function getNoteById(noteId: number, userId: string) {
  const result = await turso.execute({
    sql: `SELECT * FROM notes WHERE id = ? AND user_id = ?`,
    args: [noteId, userId],
  });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id as number,
    entityId: row.entity_id as number,
    entityType: row.entity_type as string,
    userId: row.user_id as string,
    noteType: (row.note_type as string) || null,
    slug: (row.slug as string) || null,
    title: (row.title as string) || null,
    content: row.content as string,
    createdBy: (row.created_by as string) || null,
    tags: row.tags ? JSON.parse(row.tags as string) : [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getNoteBySlug(slug: string, userId: string) {
  const result = await turso.execute({
    sql: `SELECT * FROM notes WHERE slug = ? AND user_id = ?`,
    args: [slug, userId],
  });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id as number,
    entityId: row.entity_id as number,
    entityType: row.entity_type as string,
    userId: row.user_id as string,
    noteType: (row.note_type as string) || null,
    slug: (row.slug as string) || null,
    title: (row.title as string) || null,
    content: row.content as string,
    createdBy: (row.created_by as string) || null,
    tags: row.tags ? JSON.parse(row.tags as string) : [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getAllNotesForUser(userId: string) {
  const result = await turso.execute({
    sql: `SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC`,
    args: [userId],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    entityId: row.entity_id as number,
    entityType: row.entity_type as string,
    userId: row.user_id as string,
    noteType: (row.note_type as string) || null,
    slug: (row.slug as string) || null,
    title: (row.title as string) || null,
    content: row.content as string,
    createdBy: (row.created_by as string) || null,
    tags: row.tags ? JSON.parse(row.tags as string) : [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

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
    slug: (row.slug as string) || null,
    title: (row.title as string) || null,
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
  slug?: string | null;
  noteType: string | null;
  createdBy: string | null;
  tags: string[];
}) {
  const tagsJson = JSON.stringify(params.tags);

  // Auto-generate slug from content if not provided
  const slug =
    params.slug ||
    params.content
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 50);

  const result = await turso.execute({
    sql: `INSERT INTO notes (entity_id, entity_type, user_id, note_type, slug, content, created_by, tags)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          RETURNING id`,
    args: [
      params.entityId,
      params.entityType,
      params.userId,
      params.noteType,
      slug,
      params.content,
      params.createdBy,
      tagsJson,
    ],
  });

  return result.rows[0].id as number;
}

export async function updateNote(
  noteId: number,
  userId: string,
  updates: {
    entityId?: number;
    entityType?: string;
    noteType?: string | null;
    content?: string;
    createdBy?: string | null;
    tags?: string[];
  },
) {
  const fields: string[] = [];
  const args: any[] = [];

  if (updates.entityId !== undefined) {
    fields.push("entity_id = ?");
    args.push(updates.entityId);
  }

  if (updates.entityType !== undefined) {
    fields.push("entity_type = ?");
    args.push(updates.entityType);
  }

  if (updates.noteType !== undefined) {
    fields.push("note_type = ?");
    args.push(updates.noteType);
  }

  if (updates.content !== undefined) {
    fields.push("content = ?");
    args.push(updates.content);
  }

  if (updates.createdBy !== undefined) {
    fields.push("created_by = ?");
    args.push(updates.createdBy);
  }

  if (updates.tags !== undefined) {
    fields.push("tags = ?");
    args.push(JSON.stringify(updates.tags));
  }

  fields.push("updated_at = datetime('now')");
  args.push(noteId, userId);

  await turso.execute({
    sql: `UPDATE notes SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
    args,
  });
}

export async function linkResearchToNote(
  noteId: number,
  researchIds: number[],
) {
  // First, remove existing links
  await turso.execute({
    sql: `DELETE FROM notes_research WHERE note_id = ?`,
    args: [noteId],
  });

  // Then add new links
  for (const researchId of researchIds) {
    await turso.execute({
      sql: `INSERT INTO notes_research (note_id, research_id) VALUES (?, ?)`,
      args: [noteId, researchId],
    });
  }
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
  turso, // Expose turso client for direct access
  getGoal,
  listGoals,
  createGoal,
  updateGoal,
  upsertTherapyResearch,
  listTherapyResearch,
  getResearchForNote,
  getNoteById,
  getNoteBySlug,
  getAllNotesForUser,
  listNotesForEntity,
  createNote,
  updateNote,
  linkResearchToNote,
  createGenerationJob,
  updateGenerationJob,
  getGenerationJob,
};
