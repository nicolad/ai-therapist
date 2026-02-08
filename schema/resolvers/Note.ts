import type { NoteResolvers } from "./../types.generated";
import { tursoTools } from "@/src/db";
import { createTursoStorageAdapter } from "@/src/adapters/turso-storage.adapter";

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

  goal: async (parent, _args, _ctx) => {
    // Only fetch goal if the note is linked to a Goal entity
    if (parent.entityType !== "Goal") {
      return null;
    }

    try {
      const goal = await tursoTools.getGoal(parent.entityId, parent.userId);
      return {
        ...goal,
        notes: [],
        research: [],
        questions: [],
        stories: [],
      } as any;
    } catch (error) {
      // Goal not found or user doesn't have access
      return null;
    }
  },
};
