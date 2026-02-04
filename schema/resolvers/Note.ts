import type { NoteResolvers } from "./../types.generated";
import { tursoTools } from "@/src/mastra/tools/turso.tools";
import { createTursoStorageAdapter } from "@/src/mastra/adapters/turso-storage.adapter";

export const Note: NoteResolvers = {
  linkedResearch: async (parent, _args, _ctx) => {
    const research = await tursoTools.getResearchForNote(parent.id);
    return research;
  },

  claimCards: async (parent, _args, _ctx) => {
    const storage = createTursoStorageAdapter();
    const cards = await storage.getCardsForItem?.(parent.id);
    return (cards || []) as any;
  },
};
