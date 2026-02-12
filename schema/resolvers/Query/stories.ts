import type { QueryResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const stories: NonNullable<QueryResolvers['stories']> = async (
  _parent,
  args,
  ctx,
) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  return tursoTools.listStories(args.goalId, userEmail);
};
