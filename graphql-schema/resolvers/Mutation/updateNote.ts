import type { MutationResolvers } from "@/schema/types.generated";
import { db, notes as notesTable } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export const updateNote: NonNullable<MutationResolvers['updateNote']> = async (
  _parent,
  { id, input },
  _ctx,
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const updateData: any = {};

    if (input.noteType !== undefined) updateData.noteType = input.noteType;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.createdBy !== undefined) updateData.createdBy = input.createdBy;
    if (input.tags !== undefined) updateData.tags = input.tags;

    const [updatedNote] = await db
      .update(notesTable)
      .set(updateData)
      .where(eq(notesTable.id, id))
      .returning();

    if (!updatedNote) {
      throw new Error("Note not found");
    }

    return updatedNote as any;
  } catch (error) {
    console.error("Error updating note:", error);
    throw new Error("Failed to update note");
  }
};
