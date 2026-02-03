import type { QueryResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/mastra/tools/turso.tools";

export const note: NonNullable<QueryResolvers['note']> = async (
  _parent,
  args,
  _ctx,
) => {
  const notes = await tursoTools.listNotesForEntity(
    args.id,
    "note",
    args.userId,
  );

  const foundNote = notes.find((n) => n.id === args.id);

  if (!foundNote) {
    return null;
  }

  return {
    id: foundNote.id,
    entityId: foundNote.entityId,
    entityType: foundNote.entityType,
    userId: foundNote.userId,
    noteType: foundNote.noteType || null,
    content: foundNote.content,
    createdBy: foundNote.createdBy || null,
    tags: foundNote.tags || null,
    createdAt: foundNote.createdAt,
    updatedAt: foundNote.updatedAt,
  };
};
