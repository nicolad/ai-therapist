import type { MutationResolvers } from "@/schema/types.generated";
import {
  db,
  goals as goalsTable,
  therapyResearch as therapyResearchTable,
  familyMembers,
} from "@/lib/db";
import { eq } from "drizzle-orm";
import { differenceInYears } from "date-fns";

/**
 * Generate therapeutic long-form text using Cloudflare Container + LangGraph + DeepSeek
 *
 * This mutation calls the TTS container's /api/text/generate endpoint directly.
 * The container (tts-container/langgraph_server.py) handles:
 * - Building the therapeutic prompt from research data
 * - DeepSeek API call via LangGraph
 * - Returns the generated text synchronously
 */
export const generateLongFormText: NonNullable<MutationResolvers['generateLongFormText']> = async (_parent, { goalId, language, minutes }, ctx) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Fetch goal, research, and family member data for validation
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

    const research = await db
      .select()
      .from(therapyResearchTable)
      .where(eq(therapyResearchTable.goalId, goalId));

    if (research.length === 0) {
      return {
        success: false,
        message:
          "No therapy research found. Please generate research first using the 'Generate Research' button.",
        text: null,
        audioUrl: null,
        manifestUrl: null,
        segmentUrls: null,
      };
    }

    const [familyMember] = await db
      .select()
      .from(familyMembers)
      .where(eq(familyMembers.id, goal.familyMemberId));

    if (!familyMember) {
      throw new Error("Family member not found");
    }

    // Calculate age if dateOfBirth exists
    const age = familyMember.dateOfBirth
      ? differenceInYears(new Date(), new Date(familyMember.dateOfBirth))
      : null;

    console.log("\n========== Cloudflare Container Text Generation ==========");
    console.log("🎯 Goal ID:", goalId);
    console.log("📝 Goal Title:", goal.title);
    console.log("🔬 Research Sources:", research.length);
    console.log("👤 Family Member:", familyMember.firstName, `(age: ${age})`);
    console.log("⏱️ Minutes:", minutes || "default");
    console.log("======================================================\n");

    // Build comprehensive prompt for the container
    const researchSummary = research
      .map((r) => {
        const parts = [`Title: ${r.title}`];
        if (r.journal) parts.push(`Journal: ${r.journal}`);
        if (r.url) parts.push(`URL: ${r.url}`);
        if (r.abstract) parts.push(`Abstract: ${r.abstract}`);
        if (r.keyFindings && r.keyFindings.length > 0) {
          parts.push(`Key Findings: ${r.keyFindings.join(", ")}`);
        }
        if (r.therapeuticTechniques && r.therapeuticTechniques.length > 0) {
          parts.push(
            `Therapeutic Techniques: ${r.therapeuticTechniques.join(", ")}`,
          );
        }
        return parts.join("\n");
      })
      .join("\n\n");

    const prompt = [
      `Goal: ${goal.title}`,
      `Description: ${goal.description || "No description provided"}`,
      `Goal category: ${goal.category || "other"}`,
      `Person context: name=${familyMember.firstName}, relationship=${familyMember.relationship || "unknown"}, age=${age ?? "unknown"}`,
      `Target duration: ${minutes ? `${minutes} minutes` : "default length"}`,
      "",
      "Research items (use as grounding):",
      researchSummary,
      "",
      "Task: produce a structured long-form therapeutic guidance text with:",
      "1) brief summary",
      "2) explanation (why this helps)",
      "3) step-by-step practices/exercises",
      "4) tailoring to the person context",
      "5) simple weekly plan",
    ].join("\n");

    // Call the Cloudflare Container directly
    if (ctx.env?.AGENT_CONTAINER) {
      console.log("📦 Calling Agent Container...");

      // Get a container instance
      const containerId = ctx.env.AGENT_CONTAINER.idFromName("agent-default");
      const containerStub = ctx.env.AGENT_CONTAINER.get(containerId);

      // Call the text generation endpoint
      const response = await containerStub.fetch(
        "http://container/api/text/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal_id: goalId,
            prompt,
            language: language || "Romanian",
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Container error:", errorText);
        throw new Error(`Container request failed: ${response.status}`);
      }

      const result = (await response.json()) as {
        success: boolean;
        message: string;
        text?: string;
      };
      console.log("✅ Container response:", result);

      if (!result.success || !result.text) {
        throw new Error(result.message || "Failed to generate text");
      }

      // Update the goal with the generated text
      await db
        .update(goalsTable)
        .set({
          therapeuticText: result.text,
          therapeuticTextLanguage: language || "Romanian",
          therapeuticTextGeneratedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(goalsTable.id, goalId));

      return {
        success: true,
        message: `Text generated successfully (${result.text.length} characters)`,
        text: result.text,
        audioUrl: null,
        manifestUrl: null,
        segmentUrls: null,
      };
    } else {
      // Fallback: call container via HTTP endpoint (for local dev or Vercel deployment)
      console.log("📤 Calling container via HTTP endpoint...");

      const containerUrl =
        process.env.AGENT_CONTAINER_URL ||
        (process.env.NODE_ENV === "development"
          ? "http://localhost:8080"
          : "https://crm-agent-container.vadim.workers.dev");

      const response = await fetch(`${containerUrl}/api/text/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_id: goalId,
          prompt,
          language: language || "Romanian",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Container HTTP error:", errorText);
        throw new Error(`Container HTTP request failed: ${response.status}`);
      }

      const result = (await response.json()) as {
        success: boolean;
        message: string;
        text?: string;
      };
      console.log("✅ Container HTTP response:", result);

      if (!result.success || !result.text) {
        throw new Error(result.message || "Failed to generate text");
      }

      // Update the goal with the generated text
      await db
        .update(goalsTable)
        .set({
          therapeuticText: result.text,
          therapeuticTextLanguage: language || "Romanian",
          therapeuticTextGeneratedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(goalsTable.id, goalId));

      return {
        success: true,
        message: `Text generated successfully (${result.text.length} characters)`,
        text: result.text,
        audioUrl: null,
        manifestUrl: null,
        segmentUrls: null,
      };
    }
  } catch (error) {
    console.error("Error queueing therapeutic text generation:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to queue text generation",
      text: null,
      audioUrl: null,
      manifestUrl: null,
      segmentUrls: null,
    };
  }
};
