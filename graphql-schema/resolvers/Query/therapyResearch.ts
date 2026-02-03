import type { QueryResolvers } from "@/schema/types.generated";
import { db, therapyResearch as therapyResearchTable } from "@/lib/db";
import { eq } from "drizzle-orm";

export const therapyResearch: NonNullable<QueryResolvers['therapyResearch']> = async (_parent, { goalId }, _ctx) => {
  const research = await db
    .select()
    .from(therapyResearchTable)
    .where(eq(therapyResearchTable.goalId, goalId));

  return research as any;
};
