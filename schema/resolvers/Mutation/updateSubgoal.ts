import type { MutationResolvers } from "./../../types.generated";
import { d1Tools } from "@/src/db";

export const updateSubgoal: NonNullable<MutationResolvers['updateSubgoal']> = async (_parent, args, ctx) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  const subgoal = await d1Tools.updateSubgoal(args.id, userEmail, args.input);
  if (!subgoal) {
    throw new Error("Failed to update subgoal");
  }

  return subgoal;
};
