import type { QueryResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const goals: NonNullable<QueryResolvers["goals"]> = async (
  _parent,
  args,
  ctx,
) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  const goalsList = await tursoTools.listGoals(
    userEmail,
    args.familyMemberId ?? undefined,
  );

  // Filter by status if provided
  let filtered = goalsList;
  if (args.status) {
    filtered = goalsList.filter((goal) => goal.status === args.status);
  }

  return filtered.map((goal) => ({
    id: goal.id,
    familyMemberId: goal.familyMemberId,
    createdBy: goal.createdBy,
    title: goal.title,
    description: goal.description,
    status: goal.status,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
    research: [],
    questions: [],
    stories: [],
    notes: [],
  }));
};
