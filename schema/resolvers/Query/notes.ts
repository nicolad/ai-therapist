import type { QueryResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const notes: NonNullable<QueryResolvers['notes']> = async (
  _parent,
  args,
  ctx,
) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  const notesList = await tursoTools.listNotesForEntity(
    args.entityId,
    args.entityType,
    userEmail,
  );

  return notesList.map((note) => ({
    id: note.id,
    entityId: note.entityId,
    entityType: note.entityType,
    createdBy: note.createdBy || userEmail,
    noteType: note.noteType || null,
    slug: note.slug || null,
    content: note.content,
    tags: note.tags,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }));
};
