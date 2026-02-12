import type { MutationResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";
import { updateGoal as updateGoalDb } from "@/src/db";

export const updateGoal: NonNullable<MutationResolvers['updateGoal']> = async (
  _parent,
  args,
  ctx,
) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  await updateGoalDb(args.id, userEmail, {
    title: args.input.title ?? undefined,
    description: args.input.description ?? undefined,
    targetDate: args.input.targetDate ?? undefined,
    status: args.input.status ?? undefined,
  });

  // Fetch the updated goal to return it
  const goal = await tursoTools.getGoal(args.id, userEmail);

  return {
    id: goal.id,
    familyMemberId: goal.familyMemberId,
    createdBy: goal.createdBy,
    title: goal.title,
    description: goal.description,
    targetDate: goal.targetDate,
    status: goal.status,
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
