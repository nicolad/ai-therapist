import type { MutationResolvers } from "@/schema/types.generated";
import { db, goals as goalsTable } from "@/lib/db";
import { eq } from "drizzle-orm";

export const updateGoal: NonNullable<MutationResolvers['updateGoal']> = async (
  _parent,
  { id, input },
  _ctx,
) => {
  try {
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (input.title !== undefined && input.title !== null)
      updateData.title = input.title;
    if (input.description !== undefined && input.description !== null)
      updateData.description = input.description;
    if (input.status !== undefined && input.status !== null)
      updateData.status = input.status;
    if (input.priority !== undefined && input.priority !== null)
      updateData.priority = input.priority;
    if (input.targetDate !== undefined && input.targetDate !== null)
      updateData.targetDate = input.targetDate;
    // TODO: failedAttempts field doesn't exist in schema
    // if (input.failedAttempts !== undefined && input.failedAttempts !== null)
    //   updateData.failedAttempts = input.failedAttempts;

    const [result] = await db
      .update(goalsTable)
      .set(updateData)
      .where(eq(goalsTable.id, id))
      .returning();

    if (!result) {
      throw new Error("Goal not found");
    }

    return result as any;
  } catch (error) {
    console.error("Error updating goal:", error);
    throw new Error("Failed to update goal");
  }
};
