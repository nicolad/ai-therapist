import type { QueryResolvers } from "../../types.generated";
import { tursoTools } from "@/src/mastra/tools/turso.tools";

export const allNotes: NonNullable<QueryResolvers['allNotes']> = async (
  _parent,
  { userId }
) => {
  const notes = await tursoTools.getAllNotesForUser(userId);
  return notes;
};
