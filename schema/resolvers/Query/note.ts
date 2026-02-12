import type { QueryResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const note: NonNullable<QueryResolvers['note']> = async (
  _parent,
  args,
  _ctx,
) => {
  let foundNote;

  if (args.slug) {
    // Query by slug
    foundNote = await tursoTools.getNoteBySlug(args.slug, args.userId);
  } else if (args.id) {
    // Query by ID
    foundNote = await tursoTools.getNoteById(args.id, args.userId);
  } else {
    return null;
  }

  if (!foundNote) {
    return null;
  }

  return {
    id: foundNote.id,
    entityId: foundNote.entityId,
    entityType: foundNote.entityType,
    userId: foundNote.userId,
    noteType: foundNote.noteType || null,
    slug: foundNote.slug || null,
    title: foundNote.title || null,
    content: foundNote.content,
    createdBy: foundNote.createdBy || null,
    tags: foundNote.tags || null,
    createdAt: foundNote.createdAt,
    updatedAt: foundNote.updatedAt,
  };
};
