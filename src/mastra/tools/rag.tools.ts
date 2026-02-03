import { LibSQLVector } from "@mastra/libsql";

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "file:./therapeutic.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

/**
 * RAG Tools for Mastra Workflows
 * Manages vector embeddings and retrieval using LibSQLVector (Turso-native)
 */

// Initialize vector store
export const vectorStore = new LibSQLVector({
  id: "goal-context-v1",
  url,
  authToken,
});

/**
 * Upsert research chunks into vector store
 */
export async function upsertResearchChunks(params: {
  goalId: number;
  entityType: "TherapyResearch" | "Goal" | "Note" | "TherapeuticQuestion";
  entityId: number;
  title: string;
  abstract?: string;
  keyFindings?: string[];
  techniques?: string[];
}) {
  const {
    goalId,
    entityType,
    entityId,
    title,
    abstract,
    keyFindings,
    techniques,
  } = params;

  const chunks: Array<{ text: string; metadata: any }> = [];

  // Chunk 1: Title + Abstract
  if (abstract) {
    chunks.push({
      text: `${title}\n\n${abstract}`,
      metadata: {
        goalId,
        entityType,
        entityId,
        source: "abstract",
        createdAt: new Date().toISOString(),
      },
    });
  }

  // Chunk 2-N: Individual key findings
  if (keyFindings && keyFindings.length > 0) {
    keyFindings.forEach((finding, idx) => {
      chunks.push({
        text: `Finding from "${title}": ${finding}`,
        metadata: {
          goalId,
          entityType,
          entityId,
          source: "finding",
          findingIndex: idx,
          createdAt: new Date().toISOString(),
        },
      });
    });
  }

  // Chunk 2-N: Individual techniques
  if (techniques && techniques.length > 0) {
    techniques.forEach((technique, idx) => {
      chunks.push({
        text: `Therapeutic technique from "${title}": ${technique}`,
        metadata: {
          goalId,
          entityType,
          entityId,
          source: "technique",
          techniqueIndex: idx,
          createdAt: new Date().toISOString(),
        },
      });
    });
  }

  // Upsert all chunks
  for (const chunk of chunks) {
    await vectorStore.index([
      {
        id: `${entityType}-${entityId}-${chunk.metadata.source}-${chunk.metadata.findingIndex || chunk.metadata.techniqueIndex || 0}`,
        text: chunk.text,
        metadata: chunk.metadata,
      },
    ]);
  }

  return chunks.length;
}

/**
 * Retrieve relevant context for a goal
 */
export async function retrieveGoalContext(
  goalId: number,
  query: string,
  topK: number = 10,
) {
  const results = await vectorStore.query(query, {
    topK,
    filter: {
      goalId,
    },
  });

  return results.map((result) => ({
    text: result.text,
    score: result.score,
    metadata: result.metadata,
  }));
}

/**
 * Upsert goal description chunks
 */
export async function upsertGoalChunks(params: {
  goalId: number;
  title: string;
  description?: string;
}) {
  const { goalId, title, description } = params;

  const text = description ? `${title}\n\n${description}` : title;

  await vectorStore.index([
    {
      id: `Goal-${goalId}-description`,
      text,
      metadata: {
        goalId,
        entityType: "Goal",
        entityId: goalId,
        source: "goal_description",
        createdAt: new Date().toISOString(),
      },
    },
  ]);
}

/**
 * Upsert note chunks
 */
export async function upsertNoteChunks(params: {
  goalId: number;
  noteId: number;
  content: string;
}) {
  const { goalId, noteId, content } = params;

  await vectorStore.index([
    {
      id: `Note-${noteId}`,
      text: content,
      metadata: {
        goalId,
        entityType: "Note",
        entityId: noteId,
        source: "note",
        createdAt: new Date().toISOString(),
      },
    },
  ]);
}

/**
 * Upsert question chunks
 */
export async function upsertQuestionChunks(params: {
  goalId: number;
  questionId: number;
  question: string;
  rationale: string;
}) {
  const { goalId, questionId, question, rationale } = params;

  const text = `Question: ${question}\n\nRationale: ${rationale}`;

  await vectorStore.index([
    {
      id: `TherapeuticQuestion-${questionId}`,
      text,
      metadata: {
        goalId,
        entityType: "TherapeuticQuestion",
        entityId: questionId,
        source: "question",
        createdAt: new Date().toISOString(),
      },
    },
  ]);
}

export const ragTools = {
  upsertResearchChunks,
  retrieveGoalContext,
  upsertGoalChunks,
  upsertNoteChunks,
  upsertQuestionChunks,
};
