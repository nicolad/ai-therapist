import type { QueryResolvers } from "./../../types.generated";
import { tursoTools } from "@/src/db";

export const note: NonNullable<QueryResolvers['note']> = async (
  _parent,
  args,
  ctx,
) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  let foundNote;

  if (args.slug) {
    // Query by slug
    foundNote = await tursoTools.getNoteBySlug(args.slug, userEmail);
  } else if (args.id) {
    // Query by ID
    foundNote = await tursoTools.getNoteById(args.id, userEmail);
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
    createdBy: foundNote.createdBy || userEmail,
    noteType: foundNote.noteType || null,
    slug: foundNote.slug || null,
    title: foundNote.title || null,
    content: foundNote.content,
    tags: foundNote.tags || null,
    createdAt: foundNote.createdAt,
    updatedAt: foundNote.updatedAt,
  };
};
