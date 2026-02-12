import type { MutationResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const createStory: NonNullable<MutationResolvers['createStory']> = async (_parent, args, ctx) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  const storyId = await tursoTools.createStory({
    goalId: args.input.goalId,
    createdBy: userEmail,
    content: args.input.content,
  });

  const story = await tursoTools.getStory(storyId, userEmail);
  if (!story) {
    throw new Error("Failed to create story");
  }

  return story;
};
