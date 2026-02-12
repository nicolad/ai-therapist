import type { QueryResolvers } from "../../types.generated";
import { tursoTools } from "@/src/db";

export const allNotes: NonNullable<QueryResolvers['allNotes']> = async (
  _parent,
  { userId },
) => {
  const notes = await tursoTools.getAllNotesForUser(userId);
  return notes;
};
