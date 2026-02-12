import type { MutationResolvers } from "./../../types.generated";
import { turso } from "@/src/db";

export const deleteNote: NonNullable<MutationResolvers['deleteNote']> = async (
  _parent,
  args,
  ctx,
) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  // Delete associated claim card links first
  await turso.execute({
    sql: `DELETE FROM notes_claims WHERE note_id = ?`,
    args: [args.id],
  });

  // Delete research links
  await turso.execute({
    sql: `DELETE FROM notes_research WHERE note_id = ?`,
    args: [args.id],
  });

  // Delete the note itself
  await turso.execute({
    sql: `DELETE FROM notes WHERE id = ? AND user_id = ?`,
    args: [args.id, userEmail],
  });

  return {
    success: true,
    message: "Note deleted successfully",
  };
};
