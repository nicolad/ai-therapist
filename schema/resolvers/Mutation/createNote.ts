import type { MutationResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/mastra/tools/turso.tools";

export const createNote: NonNullable<MutationResolvers['createNote']> = async (
  _parent,
  args,
  _ctx,
) => {
  const noteId = await tursoTools.createNote({
    entityId: args.input.entityId,
    entityType: args.input.entityType,
    userId: args.input.userId,
    content: args.input.content,
    noteType: args.input.noteType || null,
    createdBy: args.input.createdBy || null,
    tags: args.input.tags || [],
  });

  // Fetch the created note to return it
  const notes = await tursoTools.listNotesForEntity(
    args.input.entityId,
    args.input.entityType,
    args.input.userId,
  );

  const createdNote = notes.find((note) => note.id === noteId);

  if (!createdNote) {
    throw new Error("Failed to retrieve created note");
  }

  return {
    id: createdNote.id,
    entityId: createdNote.entityId,
    entityType: createdNote.entityType,
    userId: createdNote.userId,
    noteType: createdNote.noteType || null,
    content: createdNote.content,
    createdBy: createdNote.createdBy || null,
    tags: createdNote.tags,
    createdAt: createdNote.createdAt,
    updatedAt: createdNote.updatedAt,
  };
};
