import type { QueryResolvers } from "@/schema/types.generated";
import {
  db,
  therapeuticQuestions as therapeuticQuestionsTable,
} from "@/lib/db";
import { eq } from "drizzle-orm";

export const therapeuticQuestions: NonNullable<QueryResolvers['therapeuticQuestions']> = async (_parent, { goalId }, ctx) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  const questions = await db
    .select()
    .from(therapeuticQuestionsTable)
    .where(eq(therapeuticQuestionsTable.goalId, goalId));

  return questions;
};
