/**
 * Script to clean up irrelevant research for a specific goal
 * Useful after improving the research generation algorithm
 *
 * Usage:
 *   pnpm exec tsx scripts/cleanup-goal-research.ts
 */

import "dotenv/config";
import { turso } from "@/src/db/turso";

async function main() {
  const goalSlug = "advocating-for-yourself-in-interviews";
  const userId = "demo-user";

  console.log(`🧹 Cleaning up research for goal: "${goalSlug}"\n`);

  // Get the goal
  const goalResult = await turso.execute({
    sql: `SELECT id, title FROM goals WHERE title LIKE ? AND user_id = ?`,
    args: [`%${goalSlug}%`, userId],
  });

  if (goalResult.rows.length === 0) {
    console.error("❌ Goal not found");
    process.exit(1);
  }

  const goalId = goalResult.rows[0].id as number;
  console.log(`📌 Goal ID: ${goalId}`);
  console.log(`   Title: ${goalResult.rows[0].title}\n`);

  // Count existing research
  const countResult = await turso.execute({
    sql: `SELECT COUNT(*) as count FROM therapy_research WHERE goal_id = ?`,
    args: [goalId],
  });

  const count = countResult.rows[0].count as number;
  console.log(`📚 Found ${count} research papers\n`);

  if (count === 0) {
    console.log("✨ No research to clean up!");
    return;
  }

  // Delete all research for this goal
  await turso.execute({
    sql: `DELETE FROM therapy_research WHERE goal_id = ?`,
    args: [goalId],
  });

  console.log(`✅ Deleted ${count} research papers`);
  console.log(
    '\n💡 Now run: pnpm exec tsx scripts/generate-research-for-goal.ts',
  );
}

main()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
