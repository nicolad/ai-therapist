import type { QueryResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const goal: NonNullable<QueryResolvers['goal']> = async (
  _parent,
  args,
  _ctx,
) => {
  let goal;

  if (args.slug) {
    goal = await tursoTools.getGoalBySlug(args.slug, args.userId);
  } else if (args.id) {
    goal = await tursoTools.getGoal(args.id, args.userId);
  } else {
    throw new Error("Either id or slug must be provided");
  }

  return {
    id: goal.id,
    familyMemberId: goal.familyMemberId,
    userId: goal.userId,
    slug: goal.slug,
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
