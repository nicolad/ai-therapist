import type { QueryResolvers } from "../../types.generated";
import { tursoTools } from "@/src/db";

export const allNotes: NonNullable<QueryResolvers['allNotes']> = async (
  _parent,
  _args,
  ctx,
) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  const notes = await tursoTools.getAllNotesForUser(userEmail);
  return notes;
};
