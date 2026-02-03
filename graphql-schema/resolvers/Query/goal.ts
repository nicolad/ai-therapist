import type { QueryResolvers } from "@/schema/types.generated";
import { db, goals as goalsTable } from "@/lib/db";
import { eq } from "drizzle-orm";

export const goal: NonNullable<QueryResolvers['goal']> = async (
  _parent,
  { id },
  _ctx,
) => {
  try {
    const [result] = await db
      .select()
      .from(goalsTable)
      .where(eq(goalsTable.id, id))
      .limit(1);

    if (!result) {
      console.log("[Goal Resolver] Goal not found for ID:", id);
      return null;
    }

    return result as any;
  } catch (error) {
    console.error("[Goal Resolver] Error fetching goal:", error);
    console.error("[Goal Resolver] Error stack:", (error as Error).stack);
    return null;
  }
};
