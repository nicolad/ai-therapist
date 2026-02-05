/**
 * Script to create a goal and link an existing note to it
 *
 * Usage:
 *   tsx scripts/link-note-to-goal.ts --noteSlug=<slug> --goalTitle="Goal Title"
 *   OR
 *   tsx scripts/link-note-to-goal.ts --noteId=<id> --goalTitle="Goal Title"
 */

import { tursoTools, turso } from "@/src/mastra/tools/turso.tools";

async function main() {
  const args = process.argv.slice(2);

  // Parse command line arguments
  let noteSlug: string | undefined;
  let noteId: number | undefined;
  let goalTitle = "Strengthen Resilience in a Tough Job Search";
  let goalDescription: string | undefined;
  let userId = "demo-user";
  let familyMemberId = 1;

  for (const arg of args) {
    if (arg.startsWith("--noteSlug=")) {
      noteSlug = arg.split("=")[1];
    } else if (arg.startsWith("--noteId=")) {
      noteId = parseInt(arg.split("=")[1]);
    } else if (arg.startsWith("--goalTitle=")) {
      goalTitle = arg.split("=")[1];
    } else if (arg.startsWith("--goalDescription=")) {
      goalDescription = arg.split("=")[1];
    } else if (arg.startsWith("--userId=")) {
      userId = arg.split("=")[1];
    } else if (arg.startsWith("--familyMemberId=")) {
      familyMemberId = parseInt(arg.split("=")[1]);
    }
  }

  console.log("🎯 Creating goal and linking note...\n");

  // Step 1: Find the note
  let note;
  if (noteSlug) {
    console.log(`📝 Finding note by slug: ${noteSlug}`);
    note = await tursoTools.getNoteBySlug(noteSlug, userId);
  } else if (noteId) {
    console.log(`📝 Finding note by ID: ${noteId}`);
    note = await tursoTools.getNoteById(noteId, userId);
  } else {
    // If no note specified, list all notes to help the user
    console.log("❌ No note specified. Use --noteSlug or --noteId");
    console.log("\nListing all existing notes:\n");

    const result = await turso.execute({
      sql: `SELECT id, slug, entity_type, entity_id, content, tags, created_at FROM notes WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      args: [userId],
    });

    if (result.rows.length === 0) {
      console.log("No notes found.");
    } else {
      result.rows.forEach((row) => {
        const tags = row.tags ? JSON.parse(row.tags as string) : [];
        const preview = (row.content as string).substring(0, 100);
        console.log(`ID: ${row.id}`);
        console.log(`Slug: ${row.slug}`);
        console.log(`Entity: ${row.entity_type}/${row.entity_id}`);
        console.log(`Tags: ${tags.join(", ")}`);
        console.log(`Created: ${row.created_at}`);
        console.log(`Preview: ${preview}...`);
        console.log("---");
      });
    }
    return;
  }

  if (!note) {
    console.error("❌ Note not found!");
    return;
  }

  console.log(`✅ Found note: ID=${note.id}, Slug=${note.slug}`);
  console.log(`   Current entity: ${note.entityType}/${note.entityId}`);
  console.log(`   Tags: ${note.tags.join(", ")}`);
  console.log(`   Created: ${note.createdAt}\n`);

  // Get linked research count
  const linkedResearch = await tursoTools.getResearchForNote(note.id);
  console.log(`   Linked Research: ${linkedResearch.length} papers\n`);

  // Step 2: Create the goal
  console.log(`🎯 Creating goal: "${goalTitle}"`);
  const goalId = await tursoTools.createGoal({
    familyMemberId,
    userId,
    title: goalTitle,
    description: goalDescription || null,
    priority: "high",
  });

  const goal = await tursoTools.getGoal(goalId, userId);
  console.log(`✅ Created goal: ID=${goal.id}`);
  console.log(`   Title: ${goal.title}`);
  console.log(`   Priority: ${goal.priority}`);
  console.log(`   Status: ${goal.status}\n`);

  // Step 3: Update the note to link to the goal
  console.log(`🔗 Linking note ${note.id} to goal ${goalId}...`);
  await tursoTools.updateNote(note.id, userId, {
    entityId: goalId,
    entityType: "Goal",
  });

  const updatedNote = await tursoTools.getNoteById(note.id, userId);
  console.log(`✅ Updated note successfully!`);
  console.log(
    `   New entity: ${updatedNote?.entityType}/${updatedNote?.entityId}\n`,
  );

  console.log("🎉 Done! The note is now linked to the goal.");
  console.log(`\nSummary:`);
  console.log(`   Goal ID: ${goalId}`);
  console.log(`   Goal Title: ${goal.title}`);
  console.log(`   Note ID: ${note.id}`);
  console.log(`   Note Slug: ${note.slug}`);
  console.log(`   Linked Research: ${linkedResearch.length} papers`);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
