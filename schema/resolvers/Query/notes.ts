import type { QueryResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/mastra/tools/turso.tools";

export const notes: NonNullable<QueryResolvers['notes']> = async (
  _parent,
  args,
  _ctx,
) => {
  const notesList = await tursoTools.listNotesForEntity(
    args.entityId,
    args.entityType,
    args.userId,
  );

  return notesList.map((note) => ({
    id: note.id,
    entityId: note.entityId,
    entityType: note.entityType,
    userId: note.userId,
    noteType: note.noteType || null,
    content: note.content,
    createdBy: note.createdBy || null,
    tags: note.tags,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }));
};
