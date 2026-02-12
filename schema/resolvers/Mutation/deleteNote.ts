import type { MutationResolvers } from "./../../types.generated";
import { turso } from "@/src/db";

export const deleteNote: NonNullable<MutationResolvers['deleteNote']> = async (
  _parent,
  args,
  ctx,
) => {
  const userId = ctx.userId || "demo-user";

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
    args: [args.id, userId],
  });

  return {
    success: true,
    message: "Note deleted successfully",
  };
};
