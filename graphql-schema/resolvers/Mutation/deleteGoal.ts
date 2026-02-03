import type { MutationResolvers } from "@/schema/types.generated";
import { db, goals as goalsTable } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export const deleteGoal: NonNullable<MutationResolvers['deleteGoal']> = async (
  _parent,
  { id },
  ctx,
) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify the goal exists and belongs to the current user
    const [goal] = await db
      .select()
      .from(goalsTable)
      .where(and(eq(goalsTable.id, id), eq(goalsTable.userId, ctx.userId)));

    if (!goal) {
      throw new Error("Goal not found");
    }

    // Delete the goal
    await db
      .delete(goalsTable)
      .where(and(eq(goalsTable.id, id), eq(goalsTable.userId, ctx.userId)));

    return {
      success: true,
      message: "Goal deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete goal",
    };
  }
};
