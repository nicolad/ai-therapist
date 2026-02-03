import type { QueryResolvers } from "@/schema/types.generated";
import { db, notes as notesTable } from "@/lib/db";
import { eq, desc, and } from "drizzle-orm";

export const notes: NonNullable<QueryResolvers['notes']> = async (
  _parent,
  { entityId, entityType },
  _ctx,
) => {
  try {
    const notesList = await db
      .select()
      .from(notesTable)
      .where(
        and(
          eq(notesTable.entityId, entityId),
          eq(notesTable.entityType, entityType),
        ),
      )
      .orderBy(desc(notesTable.createdAt));

    return notesList as any;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};
