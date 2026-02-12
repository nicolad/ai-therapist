import type { MutationResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const updateNote: NonNullable<MutationResolvers['updateNote']> = async (
  _parent,
  args,
  ctx,
) => {
  const userId = ctx.userId || "demo-user";

  // Update the note
  await tursoTools.updateNote(args.id, userId, {
    noteType: args.input.noteType ?? undefined,
    content: args.input.content ?? undefined,
    createdBy: args.input.createdBy ?? undefined,
    tags: args.input.tags ?? undefined,
  });

  // Update linked research if provided
  if (args.input.linkedResearchIds) {
    await tursoTools.linkResearchToNote(args.id, args.input.linkedResearchIds);
  }

  // Fetch the updated note
  const note = await tursoTools.getNoteById(args.id, userId);

  if (!note) {
    throw new Error(`Note ${args.id} not found`);
  }

  return {
    id: note.id,
    entityId: note.entityId,
    entityType: note.entityType,
    userId: note.userId,
    noteType: note.noteType,
    slug: note.slug,
    content: note.content,
    createdBy: note.createdBy,
    tags: note.tags,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
};
