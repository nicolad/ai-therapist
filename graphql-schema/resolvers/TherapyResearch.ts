import type { TherapyResearchResolvers } from "@/schema/types.generated";
import { db, goals as goalsTable } from "@/lib/db";
import { eq } from "drizzle-orm";

export const TherapyResearch: TherapyResearchResolvers = {
  goal: async (parent, _args, _ctx) => {
    const [goal] = await db
      .select()
      .from(goalsTable)
      .where(eq(goalsTable.id, parent.goalId))
      .limit(1);

    return (goal || null) as any;
  },
};
