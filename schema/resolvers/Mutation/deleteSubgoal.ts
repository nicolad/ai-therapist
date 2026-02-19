import type { MutationResolvers } from "./../../types.generated";
import { d1Tools } from "@/src/db";

export const deleteSubgoal: NonNullable<MutationResolvers['deleteSubgoal']> = async (_parent, args, ctx) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  await d1Tools.deleteSubgoal(args.id, userEmail);

  return {
    success: true,
    message: "Subgoal deleted successfully",
  };
};
