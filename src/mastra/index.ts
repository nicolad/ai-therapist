import { createLogger } from "@mastra/core/logger";
import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";

import {
  storyTellerAgent,
  therapeuticAgent,
  therapeuticAgentElevenLabs,
} from "./agents";

// Configure libSQL storage for message history, traces, and evals
const storage = new LibSQLStore({
  id: "therapeutic-storage",
  url: process.env.DATABASE_URL || "file:./therapeutic.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const mastra = new Mastra({
  agents: {
    storyTellerAgent,
    therapeuticAgent,
    therapeuticAgentElevenLabs,
  },
  storage, // Automatically calls init() and creates core schema
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
});
