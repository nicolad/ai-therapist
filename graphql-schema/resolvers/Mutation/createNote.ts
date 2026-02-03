import type { MutationResolvers } from "@/schema/types.generated";
import { db, notes as notesTable } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const createNote: NonNullable<MutationResolvers['createNote']> = async (
  _parent,
  { input },
  _ctx,
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const [newNote] = await db
      .insert(notesTable)
      .values({
        entityId: input.entityId,
        entityType: input.entityType,
        userId,
        noteType: input.noteType || "GENERAL",
        content: input.content,
        createdBy: input.createdBy || null,
        tags: input.tags || null,
      })
      .returning();

    return newNote as any;
  } catch (error) {
    console.error("Error creating note:", error);
    throw new Error("Failed to create note");
  }
};
