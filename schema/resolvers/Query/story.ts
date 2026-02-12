import type { QueryResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const story: NonNullable<QueryResolvers['story']> = async (
  _parent,
  args,
  ctx,
) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  return tursoTools.getStory(args.id, userEmail);
};
