import type { MutationResolvers } from "./../../types.generated";
import { d1Tools } from "@/src/db";

export const createSubgoal: NonNullable<MutationResolvers['createSubgoal']> = async (_parent, args, ctx) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  const subgoalId = await d1Tools.createSubgoal({
    goalId: args.input.goalId,
    createdBy: userEmail,
    title: args.input.title,
    description: args.input.description || null,
  });

  const subgoal = await d1Tools.getSubgoal(subgoalId, userEmail);
  if (!subgoal) {
    throw new Error("Failed to create subgoal");
  }

  return subgoal;
};
