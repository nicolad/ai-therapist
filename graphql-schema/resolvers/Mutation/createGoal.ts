import type { MutationResolvers } from "@/schema/types.generated";
import { db, goals as goalsTable } from "@/lib/db";

export const createGoal: NonNullable<MutationResolvers['createGoal']> = async (
  _parent,
  { input },
  ctx,
) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  try {
    const [result] = await db
      .insert(goalsTable)
      .values({
        familyMemberId: input.familyMemberId,
        userId: ctx.userId,
        title: input.title,
        description: input.description,
        targetDate: input.targetDate,
        priority: input.priority || "medium",
        status: "pending",
      })
      .returning();

    return result as any;
  } catch (error) {
    console.error("Error creating goal:", error);
    throw new Error("Failed to create goal");
  }
};
