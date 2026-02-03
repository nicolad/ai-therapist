import type { QueryResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/mastra/tools/turso.tools";

export const goals: NonNullable<QueryResolvers["goals"]> = async (
  _parent,
  args,
  _ctx,
) => {
  const goalsList = await tursoTools.listGoals(
    args.userId,
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
    userId: goal.userId,
    title: goal.title,
    description: goal.description,
    targetDate: goal.targetDate,
    status: goal.status,
    priority: goal.priority,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
    research: [],
    questions: [],
    stories: [],
    notes: [],
  }));
};
