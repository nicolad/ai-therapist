import { createLogger } from "@mastra/core/logger";
import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";

import { storyTellerAgent, therapeuticAgent } from "./agents";
import { generateTherapyResearchWorkflow } from "./workflows";

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "file:./therapeutic.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

// Configure libSQL storage for message history, traces, and evals
const storage = new LibSQLStore({
  id: "mastra-store",
  url,
  authToken,
});

// Configure libSQL vectors for RAG (goal context, research, notes)
const vectors = {
  goalContext: new LibSQLVector({
    id: "goal-context-v1",
    url,
    authToken,
  }),
};

export const mastra = new Mastra({
  agents: {
    storyTellerAgent,
    therapeuticAgent,
  },
  storage,
  vectors,
  workflows: {
    generateTherapyResearchWorkflow,
  },
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
});
