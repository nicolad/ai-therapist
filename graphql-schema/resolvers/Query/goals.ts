import type { QueryResolvers } from "@/schema/types.generated";
import { db, goals as goalsTable } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";

export const goals: NonNullable<QueryResolvers['goals']> = async (
  _parent,
  { familyMemberId, status },
  _ctx,
) => {
  try {
    console.log("[Goals Query] Input:", { familyMemberId, status });

    const conditions = [];

    if (familyMemberId !== null && familyMemberId !== undefined) {
      conditions.push(eq(goalsTable.familyMemberId, familyMemberId));
    }

    if (status) {
      conditions.push(eq(goalsTable.status, status));
    }

    let query = db.select().from(goalsTable);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const allGoals = await query.orderBy(desc(goalsTable.createdAt));

    console.log("[Goals Query] Result count:", allGoals.length);
    if (familyMemberId) {
      console.log(
        "[Goals Query] Sample goals:",
        allGoals.slice(0, 2).map((g) => ({ id: g.id, title: g.title })),
      );
    }

    return allGoals as any;
  } catch (error) {
    console.error("Error fetching goals:", error);
    return [];
  }
};
