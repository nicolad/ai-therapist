import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { turso } from "./turso";

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

/**
 * Database operations for goals, research, questions, notes, and jobs
 */

// ============================================
// Goals
// ============================================

export async function getGoal(goalId: number, createdBy: string) {
  const result = await turso.execute({
    sql: `SELECT * FROM goals WHERE id = ? AND user_id = ?`,
    args: [goalId, createdBy],
  });

  if (result.rows.length === 0) {
    throw new Error(`Goal ${goalId} not found`);
  }

  const row = result.rows[0];
  return {
    id: row.id as number,
    familyMemberId: row.family_member_id as number,
    createdBy: row.user_id as string,
    slug: (row.slug as string) || null,
    title: row.title as string,
    description: (row.description as string) || null,
    status: row.status as string,
    therapeuticText: (row.therapeutic_text as string) || null,
    therapeuticTextLanguage: (row.therapeutic_text_language as string) || null,
    therapeuticTextGeneratedAt:
      (row.therapeutic_text_generated_at as string) || null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getGoalBySlug(slug: string, createdBy: string) {
  const result = await turso.execute({
    sql: `SELECT * FROM goals WHERE slug = ? AND user_id = ?`,
    args: [slug, createdBy],
  });

  if (result.rows.length === 0) {
    throw new Error(`Goal with slug "${slug}" not found`);
  }

  const row = result.rows[0];
  return {
    id: row.id as number,
    familyMemberId: row.family_member_id as number,
    createdBy: row.user_id as string,
    slug: (row.slug as string) || null,
    title: row.title as string,
    description: (row.description as string) || null,
    status: row.status as string,
    therapeuticText: (row.therapeutic_text as string) || null,
    therapeuticTextLanguage: (row.therapeutic_text_language as string) || null,
    therapeuticTextGeneratedAt:
      (row.therapeutic_text_generated_at as string) || null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function listGoals(
  createdBy: string,
  familyMemberId?: number,
  status?: string,
) {
  let sql = `SELECT * FROM goals WHERE user_id = ?`;
  const args: any[] = [createdBy];

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
    createdBy: row.user_id as string,
    title: row.title as string,
    description: (row.description as string) || null,
    status: row.status as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

export async function createGoal(params: {
  familyMemberId: number;
  createdBy: string;
  slug?: string;
  title: string;
  description?: string | null;
}) {
  const status = "active";

  const result = await turso.execute({
    sql: `INSERT INTO goals (family_member_id, user_id, slug, title, description, status)
          VALUES (?, ?, ?, ?, ?, ?)
          RETURNING id`,
    args: [
      params.familyMemberId,
      params.createdBy,
      params.slug || null,
      params.title,
      params.description || null,
      status,
    ],
  });

  return result.rows[0].id as number;
}

export async function updateGoal(
  goalId: number,
  createdBy: string,
  updates: {
    slug?: string;
    title?: string;
    description?: string | null;
    status?: string;
  },
) {
  const fields: string[] = [];
  const args: any[] = [];

  if (updates.slug !== undefined) {
    fields.push("slug = ?");
    args.push(updates.slug);
  }

  if (updates.title !== undefined) {
    fields.push("title = ?");
    args.push(updates.title);
  }

  if (updates.description !== undefined) {
    fields.push("description = ?");
    args.push(updates.description);
  }

  if (updates.status !== undefined) {
    fields.push("status = ?");
    args.push(updates.status);
  }

  fields.push("updated_at = datetime('now')");
  args.push(goalId, createdBy);

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

  const authorsJson = JSON.stringify(
    (research.authors || []).filter((a: any) => typeof a === "string"),
  );
  const keyFindingsJson = JSON.stringify(
    (research.keyFindings || []).filter((k: any) => typeof k === "string"),
  );
  const techniquesJson = JSON.stringify(
    (research.therapeuticTechniques || []).filter(
      (t: any) => typeof t === "string",
    ),
  );

  // Validate and sanitize numeric values - SQLite doesn't support NaN or Infinity
  const sanitizeNumber = (
    value: number | undefined | null,
    defaultValue: number = 0,
  ): number | null => {
    if (value === null || value === undefined) return null;
    if (!Number.isFinite(value)) return defaultValue;
    return value;
  };

  const relevanceScore = sanitizeNumber(research.relevanceScore, 0);
  const extractionConfidence = sanitizeNumber(research.extractionConfidence, 0);

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
        relevanceScore,
        research.extractedBy,
        extractionConfidence,
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
        relevanceScore,
        research.extractedBy,
        extractionConfidence,
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
    sql: `SELECT * FROM notes WHERE id = ?`,
    args: [noteId],
  });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id as number,
    entityId: row.entity_id as number,
    entityType: row.entity_type as string,
    createdBy: row.user_id as string,
    noteType: (row.note_type as string) || null,
    slug: (row.slug as string) || null,
    title: (row.title as string) || null,
    content: row.content as string,
    tags: row.tags ? JSON.parse(row.tags as string) : [],
    visibility: (row.visibility as string) || 'PRIVATE',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getNoteBySlug(slug: string, userId: string) {
  const result = await turso.execute({
    sql: `SELECT * FROM notes WHERE slug = ?`,
    args: [slug],
  });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id as number,
    entityId: row.entity_id as number,
    entityType: row.entity_type as string,
    createdBy: row.user_id as string,
    noteType: (row.note_type as string) || null,
    slug: (row.slug as string) || null,
    title: (row.title as string) || null,
    content: row.content as string,
    tags: row.tags ? JSON.parse(row.tags as string) : [],
    visibility: (row.visibility as string) || 'PRIVATE',
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
    createdBy: row.user_id as string,
    noteType: (row.note_type as string) || null,
    slug: (row.slug as string) || null,
    title: (row.title as string) || null,
    content: row.content as string,
    tags: row.tags ? JSON.parse(row.tags as string) : [],
    visibility: (row.visibility as string) || 'PRIVATE',
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
    createdBy: row.user_id as string,
    noteType: (row.note_type as string) || null,
    slug: (row.slug as string) || null,
    title: (row.title as string) || null,
    content: row.content as string,
    tags: row.tags ? JSON.parse(row.tags as string) : [],
    visibility: (row.visibility as string) || 'PRIVATE',
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
// Note Access Control & Sharing
// ============================================

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function canViewerReadNote(
  noteId: number,
  viewerEmail: string | null,
): Promise<{ canRead: boolean; canEdit: boolean; reason: string }> {
  const result = await turso.execute({
    sql: `
      SELECT
        n.visibility,
        n.user_id as owner_email,
        CASE
          WHEN n.visibility = 'PUBLIC' THEN 1
          WHEN n.user_id = ? THEN 1
          WHEN EXISTS (
            SELECT 1 FROM note_shares s
            WHERE s.note_id = n.id AND s.email = ?
          ) THEN 1
          ELSE 0
        END AS can_read
      FROM notes n
      WHERE n.id = ?
      LIMIT 1;
    `,
    args: [viewerEmail || '', normalizeEmail(viewerEmail || ''), noteId],
  });

  if (result.rows.length === 0) {
    return { canRead: false, canEdit: false, reason: 'NOT_FOUND' };
  }

  const row = result.rows[0];
  const canRead = (row.can_read as number) === 1;
  const ownerEmail = row.owner_email as string;
  const visibility = row.visibility as string;

  if (!canRead) {
    return { canRead: false, canEdit: false, reason: 'FORBIDDEN' };
  }

  // Check if viewer is owner
  if (viewerEmail === ownerEmail) {
    return { canRead: true, canEdit: true, reason: 'OWNER' };
  }

  // Check if public
  if (visibility === 'PUBLIC') {
    return { canRead: true, canEdit: false, reason: 'PUBLIC' };
  }

  // Check share role
  const shareResult = await turso.execute({
    sql: `SELECT role FROM note_shares WHERE note_id = ? AND email = ?`,
    args: [noteId, normalizeEmail(viewerEmail || '')],
  });

  if (shareResult.rows.length > 0) {
    const role = shareResult.rows[0].role as string;
    return {
      canRead: true,
      canEdit: role === 'EDITOR',
      reason: `SHARED_${role}`,
    };
  }

  return { canRead: true, canEdit: false, reason: 'SHARED' };
}

export async function setNoteVisibility(
  noteId: number,
  visibility: 'PRIVATE' | 'PUBLIC',
  userId: string,
) {
  await turso.execute({
    sql: `UPDATE notes SET visibility = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
    args: [visibility, noteId, userId],
  });

  return getNoteById(noteId, userId);
}

export async function shareNote(
  noteId: number,
  email: string,
  role: 'READER' | 'EDITOR',
  createdBy: string,
) {
  const normalizedEmail = normalizeEmail(email);

  await turso.execute({
    sql: `
      INSERT INTO note_shares (note_id, email, role, created_by)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(note_id, email)
      DO UPDATE SET role = excluded.role
    `,
    args: [noteId, normalizedEmail, role, createdBy],
  });

  const result = await turso.execute({
    sql: `SELECT * FROM note_shares WHERE note_id = ? AND email = ?`,
    args: [noteId, normalizedEmail],
  });

  const row = result.rows[0];
  return {
    noteId: row.note_id as number,
    email: row.email as string,
    role: row.role as string,
    createdBy: row.created_by as string,
    createdAt: row.created_at as string,
  };
}

export async function unshareNote(
  noteId: number,
  email: string,
  userId: string,
) {
  const normalizedEmail = normalizeEmail(email);

  const result = await turso.execute({
    sql: `DELETE FROM note_shares WHERE note_id = ? AND email = ?`,
    args: [noteId, normalizedEmail],
  });

  return (result.rowsAffected || 0) > 0;
}

export async function getNoteShares(noteId: number) {
  const result = await turso.execute({
    sql: `SELECT * FROM note_shares WHERE note_id = ? ORDER BY created_at DESC`,
    args: [noteId],
  });

  return result.rows.map((row) => ({
    noteId: row.note_id as number,
    email: row.email as string,
    role: row.role as string,
    createdBy: row.created_by as string,
    createdAt: row.created_at as string,
  }));
}

export async function getSharedNotes(viewerEmail: string) {
  const normalizedEmail = normalizeEmail(viewerEmail);

  const result = await turso.execute({
    sql: `
      SELECT n.*
      FROM notes n
      JOIN note_shares s ON s.note_id = n.id
      WHERE s.email = ?
      ORDER BY n.updated_at DESC
    `,
    args: [normalizedEmail],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    entityId: row.entity_id as number,
    entityType: row.entity_type as string,
    createdBy: row.user_id as string,
    noteType: (row.note_type as string) || null,
    slug: (row.slug as string) || null,
    title: (row.title as string) || null,
    content: row.content as string,
    tags: row.tags ? JSON.parse(row.tags as string) : [],
    visibility: (row.visibility as string) || 'PRIVATE',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

// ============================================
// Stories
// ============================================

export async function listStories(goalId: number, createdBy: string) {
  const result = await turso.execute({
    sql: `SELECT * FROM stories WHERE goal_id = ? AND user_id = ? ORDER BY created_at DESC`,
    args: [goalId, createdBy],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    goalId: row.goal_id as number,
    createdBy: row.user_id as string,
    content: row.content as string,
    audioKey: row.audio_key as string | null,
    audioUrl: row.audio_url as string | null,
    audioGeneratedAt: row.audio_generated_at as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

export async function getStory(storyId: number, createdBy: string) {
  const result = await turso.execute({
    sql: `SELECT * FROM stories WHERE id = ? AND user_id = ?`,
    args: [storyId, createdBy],
  });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id as number,
    goalId: row.goal_id as number,
    createdBy: row.user_id as string,
    content: row.content as string,
    audioKey: row.audio_key as string | null,
    audioUrl: row.audio_url as string | null,
    audioGeneratedAt: row.audio_generated_at as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function createStory(params: {
  goalId: number;
  createdBy: string;
  content: string;
}) {
  const result = await turso.execute({
    sql: `INSERT INTO stories (goal_id, user_id, content)
          VALUES (?, ?, ?)
          RETURNING id`,
    args: [params.goalId, params.createdBy, params.content],
  });

  return result.rows[0].id as number;
}

export async function updateStory(
  storyId: number,
  createdBy: string,
  updates: {
    content?: string;
  },
) {
  const fields: string[] = [];
  const args: any[] = [];

  if (updates.content !== undefined) {
    fields.push("content = ?");
    args.push(updates.content);
  }

  fields.push("updated_at = datetime('now')");
  args.push(storyId, createdBy);

  await turso.execute({
    sql: `UPDATE stories SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
    args,
  });
}

export async function deleteStory(storyId: number, createdBy: string) {
  await turso.execute({
    sql: `DELETE FROM stories WHERE id = ? AND user_id = ?`,
    args: [storyId, createdBy],
  });
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

// ============================================
// Therapeutic Questions
// ============================================

export async function listTherapeuticQuestions(goalId: number) {
  const result = await turso.execute({
    sql: `SELECT * FROM therapeutic_questions WHERE goal_id = ? ORDER BY created_at DESC`,
    args: [goalId],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    goalId: row.goal_id as number,
    question: row.question as string,
    researchId: (row.research_id as number) || null,
    researchTitle: (row.research_title as string) || null,
    rationale: row.rationale as string,
    generatedAt: row.generated_at as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

// ============================================
// Goal Stories
// ============================================

export async function listGoalStories(goalId: number) {
  const result = await turso.execute({
    sql: `SELECT * FROM goal_stories WHERE goal_id = ? ORDER BY created_at DESC`,
    args: [goalId],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    goalId: row.goal_id as number,
    language: row.language as string,
    minutes: row.minutes as number,
    text: row.text as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

export async function getTextSegmentsForStory(storyId: number) {
  const result = await turso.execute({
    sql: `SELECT * FROM text_segments WHERE story_id = ? ORDER BY idx ASC`,
    args: [storyId],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    goalId: row.goal_id as number,
    storyId: (row.story_id as number) || null,
    idx: row.idx as number,
    text: row.text as string,
    createdAt: row.created_at as string,
  }));
}

export async function getAudioAssetsForStory(storyId: number) {
  const result = await turso.execute({
    sql: `SELECT * FROM audio_assets WHERE story_id = ? ORDER BY created_at DESC`,
    args: [storyId],
  });

  return result.rows.map((row) => ({
    id: row.id as string,
    createdBy: row.user_id as string,
    goalId: row.goal_id as number,
    storyId: (row.story_id as number) || null,
    language: row.language as string,
    voice: row.voice as string,
    mimeType: row.mime_type as string,
    manifest: JSON.parse(row.manifest as string),
    createdAt: row.created_at as string,
  }));
}

export const tursoTools = {
  getGoal,
  getGoalBySlug,
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
  canViewerReadNote,
  setNoteVisibility,
  shareNote,
  unshareNote,
  getNoteShares,
  getSharedNotes,
  listStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
  createGenerationJob,
  updateGenerationJob,
  getGenerationJob,
  listTherapeuticQuestions,
  listGoalStories,
  getTextSegmentsForStory,
  getAudioAssetsForStory,
};

// Export turso client for direct database access in scripts
export { turso };
