import type { MutationResolvers } from "@/schema/types.generated";
import { db, notes as notesTable } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export const deleteNote: NonNullable<MutationResolvers['deleteNote']> = async (
  _parent,
  { id },
  _ctx,
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await db
      .delete(notesTable)
      .where(eq(notesTable.id, id))
      .returning();

    if (!result || result.length === 0) {
      return {
        success: false,
        message: "Note not found",
      };
    }

    return {
      success: true,
      message: "Note deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting note:", error);
    return {
      success: false,
      message: "Failed to delete note",
    };
  }
};
