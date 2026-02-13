
import type { MutationResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const shareNote: NonNullable<MutationResolvers["shareNote"]> = async (
  _parent,
  args,
  ctx,
) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  // Check if user is the owner
  const note = await tursoTools.getNoteById(args.noteId, userEmail);
  if (!note) {
    throw new Error("Note not found");
  }

  if (note.createdBy !== userEmail) {
    throw new Error("Only the note owner can share it");
  }

  const share = await tursoTools.shareNote(
    args.noteId,
    args.email,
    args.role || "READER",
    userEmail,
  );

  return {
    noteId: share.noteId,
    email: share.email,
    role: (share.role as "READER" | "EDITOR") || "READER",
    createdBy: share.createdBy,
    createdAt: share.createdAt,
  };
};