import type { MutationResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";
import { updateGoal as updateGoalDb } from "@/src/db";

export const updateGoal: NonNullable<MutationResolvers['updateGoal']> = async (
  _parent,
  args,
  ctx,
) => {
  const userId = ctx.userId || "demo-user";

  await updateGoalDb(args.id, userId, {
    title: args.input.title ?? undefined,
    description: args.input.description ?? undefined,
    targetDate: args.input.targetDate ?? undefined,
    status: args.input.status ?? undefined,
    priority: args.input.priority ?? undefined,
  });

  // Fetch the updated goal to return it
  const goal = await tursoTools.getGoal(args.id, userId);

  return {
    id: goal.id,
    familyMemberId: goal.familyMemberId,
    userId: goal.userId,
    title: goal.title,
    description: goal.description,
    targetDate: goal.targetDate,
    status: goal.status,
    priority: goal.priority,
    therapeuticText: goal.therapeuticText,
    therapeuticTextLanguage: goal.therapeuticTextLanguage,
    therapeuticTextGeneratedAt: goal.therapeuticTextGeneratedAt,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
    questions: [],
    stories: [],
    notes: [],
    research: [],
  } as any;
};
