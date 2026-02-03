import type { MutationResolvers } from "@/schema/types.generated";
import { db, therapeuticQuestions } from "@/lib/db";
import { eq } from "drizzle-orm";

export const deleteTherapeuticQuestions: NonNullable<MutationResolvers['deleteTherapeuticQuestions']> = async (_parent, { goalId }, ctx) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Delete all therapeutic questions for the specified goal
    const deletedQuestions = await db
      .delete(therapeuticQuestions)
      .where(eq(therapeuticQuestions.goalId, goalId))
      .returning();

    const deletedCount = deletedQuestions.length;

    return {
      success: true,
      message: `Successfully deleted ${deletedCount} therapeutic question${deletedCount !== 1 ? "s" : ""} for goal ${goalId}`,
      deletedCount,
    };
  } catch (error: any) {
    console.error("Error deleting therapeutic questions:", error);
    return {
      success: false,
      message: error.message || "Failed to delete therapeutic questions",
      deletedCount: 0,
    };
  }
};
