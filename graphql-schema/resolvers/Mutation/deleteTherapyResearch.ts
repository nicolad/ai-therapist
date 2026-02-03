import type { MutationResolvers } from "@/schema/types.generated";
import { db, therapyResearch as therapyResearchTable } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export const deleteTherapyResearch: NonNullable<MutationResolvers['deleteTherapyResearch']> = async (_parent, { goalId }, _ctx) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const deleted = await db
      .delete(therapyResearchTable)
      .where(eq(therapyResearchTable.goalId, goalId))
      .returning();

    return {
      success: true,
      message: `Deleted ${deleted.length} research items`,
      deletedCount: deleted.length,
    };
  } catch (error) {
    console.error("Error deleting therapy research:", error);
    throw new Error("Failed to delete therapy research");
  }
};
