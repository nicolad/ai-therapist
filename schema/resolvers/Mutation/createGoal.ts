import type { MutationResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const createGoal: NonNullable<MutationResolvers['createGoal']> = async (
  _parent,
  args,
  ctx,
) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  const goalId = await tursoTools.createGoal({
    familyMemberId: args.input.familyMemberId,
    createdBy: userEmail,
    title: args.input.title,
    description: args.input.description || null,
  });

  // Fetch the created goal to return it
  const goal = await tursoTools.getGoal(goalId, userEmail);

  return {
    id: goal.id,
    familyMemberId: goal.familyMemberId,
    createdBy: goal.createdBy,
    title: goal.title,
    description: goal.description,
    status: goal.status,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
    questions: [],
    stories: [],
    userStories: [],
    notes: [],
    research: [],
  } as any;
};
