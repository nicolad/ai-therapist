import type { MutationResolvers } from "./../../../types.generated";
import {
  db,
  goals as goalsTable,
  therapyResearch as therapyResearchTable,
  familyMembers,
  therapeuticStories,
} from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { differenceInYears } from "date-fns";

export const generateAudio: NonNullable<MutationResolvers['generateAudio']> = async (_parent, { goalId, storyId, text, language, voice }, ctx) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Fetch goal and family member data
    const [goal] = await db
      .select()
      .from(goalsTable)
      .where(eq(goalsTable.id, goalId));

    if (!goal) {
      throw new Error("Goal not found");
    }

    if (!goal.familyMemberId) {
      throw new Error("Goal does not have a family member associated");
    }

    const [familyMember] = await db
      .select()
      .from(familyMembers)
      .where(eq(familyMembers.id, goal.familyMemberId));

    if (!familyMember) {
      throw new Error("Family member not found");
    }

    const research = await db
      .select()
      .from(therapyResearchTable)
      .where(eq(therapyResearchTable.goalId, goalId));

    // Fetch therapeutic story if exists
    const [therapeuticStory] = await db
      .select()
      .from(therapeuticStories)
      .where(eq(therapeuticStories.goalId, goalId))
      .orderBy(desc(therapeuticStories.createdAt))
      .limit(1);

    // AUDIO ONLY: Require existing story
    if (!therapeuticStory) {
      console.log("❌ No therapeutic story found for goal", goalId);
      return {
        success: false,
        message:
          "No therapeutic story available. Please generate story text first.",
        jobId: null,
        audioUrl: null,
      };
    }

    const age = familyMember.dateOfBirth
      ? differenceInYears(new Date(), new Date(familyMember.dateOfBirth))
      : null;

    const isVadim =
      familyMember.firstName?.toLowerCase() === "vadim" ||
      familyMember.relationship?.toLowerCase() === "self";

    const jobId = `audio-${goalId}-${Date.now()}`;

    console.log("\n========== Audio Generation Request ==========");
    console.log("🎯 Goal ID:", goalId);
    console.log("🎙️ Voice:", voice || "nova");
    console.log(
      "📝 Story text length:",
      (therapeuticStory.content || "").length,
    );
    console.log("✅ Story available: YES");
    console.log("🔗 Job ID:", jobId);
    console.log("=============================================\n");

    // Call LangGraph API - Fire and forget (don't wait for completion)
    // Use void operator to explicitly ignore the promise
    void fetch("http://localhost:8080/api/audio/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal_id: goalId,
        story_id: storyId, // Pass story_id to backend
        goal_title: goal.title,
        goal_description: goal.description || "General therapeutic guidance",
        therapeutic_goal_type:
          research[0]?.therapeuticGoalType || "emotional_regulation",
        language: "Romanian",
        is_vadim: isVadim,
        age: age,
        family_member_name: familyMember.firstName,
        relationship: familyMember.relationship,
        research_items: [],
        thread_id: jobId,
        voice: voice || "nova",
        generate_audio: true,
        skip_text_generation: true, // AUDIO ONLY - skip text generation
        therapeutic_story: {
          story_theme: therapeuticStory.therapeuticGoal,
          story_content: therapeuticStory.content,
          story_title: therapeuticStory.title,
          key_concepts: [],
          coping_strategies: [],
          character_profile: "",
          narrative_structure: [],
          interactive_elements: [],
          personalized_examples: [],
        },
      }),
      signal: AbortSignal.timeout(5000), // 5 second timeout for initial connection
    })
      .then((response) => {
        if (!response.ok) {
          console.error("❌ Audio generation request failed:", response.status);
        } else {
          console.log("✅ Audio generation request accepted");
        }
      })
      .catch((error) => {
        // Ignore timeout and connection errors for fire-and-forget
        if (error.name === "TimeoutError" || error.name === "AbortError") {
          console.log(
            "⏱️ Audio generation request sent (timeout waiting for response)",
          );
        } else {
          console.error("❌ Failed to start audio generation:", error.message);
        }
      });

    // Return immediately with job ID
    console.log("🚀 Audio generation started in background");
    return {
      success: true,
      message: `Audio generation started. Job ID: ${jobId}`,
      jobId,
      audioUrl: null, // Will be available later
    };
  } catch (error) {
    console.error("Error generating audio:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to generate audio",
      jobId: null,
      audioUrl: null,
    };
  }
};
