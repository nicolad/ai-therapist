import type { MutationResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const createGoal: NonNullable<MutationResolvers['createGoal']> = async (
  _parent,
  args,
  ctx,
) => {
  // Use userId from context if available, otherwise use a default
  const userId = ctx.userId || "demo-user";

  const goalId = await tursoTools.createGoal({
    familyMemberId: args.input.familyMemberId,
    userId,
    title: args.input.title,
    description: args.input.description || null,
    targetDate: args.input.targetDate || null,
    priority: args.input.priority || "medium",
  });

  // Fetch the created goal to return it
  const goal = await tursoTools.getGoal(goalId, userId);

  return {
    id: goal.id,
    familyMemberId: goal.familyMemberId,
    userId: goal.userId,
    title: goal.title,
    description: goal.description,
    targetDate: goal.targetDate,
    status: goal.status,
    priority: goal.priority,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
    questions: [],
    stories: [],
    notes: [],
    research: [],
  } as any;
};
