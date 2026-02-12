import type { MutationResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const updateStory: NonNullable<MutationResolvers['updateStory']> = async (_parent, args, ctx) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  await tursoTools.updateStory(args.id, userEmail, {
    content: args.input.content ?? undefined,
  });

  const story = await tursoTools.getStory(args.id, userEmail);
  if (!story) {
    throw new Error("Story not found");
  }

  return story;
};
