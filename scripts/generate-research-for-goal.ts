/**
 * Script to generate therapy research for a specific goal
 *
 * Usage:
 *   pnpm exec tsx scripts/generate-research-for-goal.ts
 *   Default goal: advocating-for-yourself-in-interviews
 */

import "dotenv/config";

// Suppress AI SDK warnings
(globalThis as any).AI_SDK_LOG_WARNINGS = false;

import { tursoTools } from "@/src/db";
import { generateTherapyResearchWorkflow } from "@/src/workflows/generateTherapyResearch.workflow";

async function main() {
  const userId = "demo-user";
  const goalSlug = "advocating-for-yourself-in-interviews";

  console.log(`🔍 Generating therapy research for goal: "${goalSlug}"\n`);

  try {
    // Get the goal
    const goal = await tursoTools.getGoalBySlug(goalSlug, userId);
    console.log(`📌 Goal: ${goal.title}`);
    console.log(`   Description: ${goal.description?.substring(0, 100)}...\n`);

    // Run the workflow
    console.log("🔬 Running research generation workflow...\n");
    const run = await generateTherapyResearchWorkflow.createRun();
    const result = await run.start({
      inputData: {
        userId,
        goalId: goal.id,
      },
    });

    console.log("✅ Workflow completed!");
    console.log(`   Status: ${result.status}`);
    if (result.status === "success") {
      console.log(`   Message: ${result.result?.message || "No message"}`);
      console.log(`   Papers found: ${result.result?.count || 0}\n`);

      // Fetch and display the research that was saved
      if (result.result?.count && result.result.count > 0) {
        console.log("📚 Found research papers:\n");
        const research = await tursoTools.listTherapyResearch(goal.id);

        research.forEach((paper, index) => {
          console.log(`${index + 1}. ${paper.title}`);
          console.log(`   Authors: ${paper.authors}`);
          if (paper.year) console.log(`   Year: ${paper.year}`);
          if (paper.journal) console.log(`   Journal: ${paper.journal}`);
          if (paper.doi) console.log(`   DOI: ${paper.doi}`);
          if (paper.url) console.log(`   URL: ${paper.url}`);
          console.log("");
        });
      }
    } else {
      console.log(`   Error: Workflow did not complete successfully`);
      if (result.status === "failed") {
        console.log(
          `   Failure: ${(result as any).error?.message || "Unknown error"}`,
        );
      }
    }
  } catch (err: any) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Unexpected error:", err);
    process.exit(1);
  });
