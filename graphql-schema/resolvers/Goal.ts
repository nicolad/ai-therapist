import type { GoalResolvers } from "@/schema/types.generated";
import {
  db,
  therapyResearch as therapyResearchTable,
  notes as notesTable,
} from "@/lib/db";
import { eq, and } from "drizzle-orm";

export const Goal: GoalResolvers = {
  research: async (parent, _args, _ctx) => {
    const research = await db
      .select()
      .from(therapyResearchTable)
      .where(eq(therapyResearchTable.goalId, parent.id));

    console.log("[Goal.research] Found research items:", research.length);
    return research as any;
  },
  notes: async (parent, _args, _ctx) => {
    console.log("[Goal.notes] Parent goal ID:", parent.id);

    const notes = await db
      .select()
      .from(notesTable)
      .where(
        and(
          eq(notesTable.entityId, parent.id),
          eq(notesTable.entityType, "goal"),
        ),
      );

    console.log("[Goal.notes] Found notes:", notes.length);
    return notes as any;
  },
  therapeuticText: (parent) => parent.therapeuticText ?? null,
  therapeuticTextLanguage: (parent) => parent.therapeuticTextLanguage ?? null,
  therapeuticTextGeneratedAt: (parent) =>
    parent.therapeuticTextGeneratedAt ?? null,
};
