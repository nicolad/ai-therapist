import type { MutationResolvers } from "@/schema/types.generated";
import {
  db,
  goals as goalsTable,
  familyMembers,
  researchJobs,
  therapyResearch,
} from "@/lib/db";
import { eq } from "drizzle-orm";
import { differenceInYears } from "date-fns";

import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateText } from "ai";

/**
 * DeepSeek client using Vercel AI SDK
 */
function getDeepSeekClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY environment variable is not set");
  }
  return createDeepSeek({ apiKey });
}

/**
 * In-memory LangGraph state for a single research run.
 * The generated research is stored in the graph checkpoint (MemorySaver) under thread_id.
 */
interface TherapyState {
  threadId: string;
  userId: string;
  goalId: number;
  goalTitle: string;
  goalDescription: string;
  therapeuticType: string;
  age: number;
  research?: string;
}

const checkpointer = new MemorySaver();

const markRunning = async (state: TherapyState) => {
  await db
    .update(researchJobs)
    .set({ status: "running" })
    .where(eq(researchJobs.threadId, state.threadId));
  return {};
};

const generateWithDeepSeek = async (state: TherapyState) => {
  const systemPrompt = [
    "You are an evidence-informed therapy research assistant.",
    "Create practical, age-appropriate research notes for a caregiver/therapist.",
    "Do not provide medical diagnosis. Do not provide unsafe instructions.",
    "Output in Markdown with clear headings and bullet points.",
  ].join("\n");

  const userPrompt = [
    `Goal title: ${state.goalTitle}`,
    `Goal description: ${state.goalDescription || "(none provided)"}`,
    `Therapeutic type: ${state.therapeuticType}`,
    `Age: ${state.age}`,
    "",
    "Produce:",
    "1) A short summary of the problem framing",
    "2) 6–10 evidence-informed strategies/interventions (with brief rationale)",
    "3) 5–8 prompts/questions to explore in sessions",
    "4) 5 keywords for further research",
    "5) A short 'what to track weekly' checklist",
  ].join("\n");

  const modelName = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";
  const deepseek = getDeepSeekClient();
  const model = deepseek(modelName);

  const result = await generateText({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: modelName === "deepseek-reasoner" ? undefined : 0.2,
  });

  return { research: result.text };
};

const markCompleted = async (state: TherapyState) => {
  // Save the generated research to the database
  if (state.research) {
    await db.insert(therapyResearch).values({
      goalId: state.goalId,
      therapeuticGoalType: state.therapeuticType,
      title: `AI-Generated Research: ${state.goalTitle}`,
      authors: ["DeepSeek AI"],
      abstract: state.research,
      keyFindings: [],
      therapeuticTechniques: [],
      relevanceScore: 1.0,
      extractedBy: "deepseek",
      extractionConfidence: 0.95,
    });
    console.log("✅ Research saved to database for goal:", state.goalId);
  }

  // Mark job as completed
  await db
    .update(researchJobs)
    .set({ status: "completed" })
    .where(eq(researchJobs.threadId, state.threadId));
  return {};
};

const therapyResearchApp = new StateGraph<TherapyState>({
  channels: {
    threadId: null,
    userId: null,
    goalId: null,
    goalTitle: null,
    goalDescription: null,
    therapeuticType: null,
    age: null,
    research: null,
  },
})
  .addNode("mark_running", markRunning)
  .addNode("generate", generateWithDeepSeek)
  .addNode("mark_completed", markCompleted)
  .addEdge(START, "mark_running")
  .addEdge("mark_running", "generate")
  .addEdge("generate", "mark_completed")
  .addEdge("mark_completed", END)
  .compile({ checkpointer });

/**
 * Optional helper: read the generated research back from the in-memory graph state.
 * (Works only while the process instance is alive, because MemorySaver is in-memory.)
 */
export async function getTherapyResearchFromThread(threadId: string) {
  const snapshot = await therapyResearchApp.getState({
    configurable: { thread_id: threadId },
  });
  return snapshot.values.research as string;
}

export const generateTherapyResearch: NonNullable<MutationResolvers['generateTherapyResearch']> = async (_parent, { goalId }, ctx) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Check API key first
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error(
        "DEEPSEEK_API_KEY environment variable is not configured. Please set it in your .env file.",
      );
    }

    // Fetch the goal
    const [goal] = await db
      .select()
      .from(goalsTable)
      .where(eq(goalsTable.id, goalId));

    if (!goal) {
      throw new Error("Goal not found");
    }

    if (!goal.familyMemberId) {
      throw new Error("Goal must be associated with a family member");
    }

    // Fetch family member for age context
    const [familyMember] = await db
      .select()
      .from(familyMembers)
      .where(eq(familyMembers.id, goal.familyMemberId));

    if (!familyMember) {
      throw new Error("Family member not found");
    }

    if (!familyMember.dateOfBirth) {
      throw new Error(
        "Family member date of birth is required for research generation",
      );
    }

    const age = differenceInYears(
      new Date(),
      new Date(familyMember.dateOfBirth),
    );

    const therapeuticType = goal.status || "general_therapy";

    const threadId = `research-${goalId}-${Date.now()}`;

    console.log(
      "\n========== LangGraph In-Memory Research Generation ==========",
    );
    console.log("🎯 Goal ID:", goalId);
    console.log("📝 Title:", goal.title);
    console.log("👤 Age:", age);
    console.log("🔬 Type:", therapeuticType);
    console.log("🔗 Thread ID:", threadId);
    console.log(
      "============================================================\n",
    );

    // Create job status record (same semantics as your queue-based version)
    await db.insert(researchJobs).values({
      threadId,
      goalId,
      userId: ctx.userId,
      status: "pending",
    });
    console.log("📝 Created job status record:", threadId);

    // Fire-and-forget: kick off the in-memory graph run without waiting
    void therapyResearchApp
      .invoke(
        {
          threadId,
          goalId,
          userId: ctx.userId,
          goalTitle: goal.title,
          goalDescription: goal.description || "",
          therapeuticType,
          age,
        },
        { configurable: { thread_id: threadId } },
      )
      .catch(async (err) => {
        console.error("❌ Therapy research graph failed:", err);
        try {
          await db
            .update(researchJobs)
            .set({ status: "failed" })
            .where(eq(researchJobs.threadId, threadId));
        } catch (updateErr) {
          console.error("❌ Failed to mark job as failed:", updateErr);
        }
      });

    return {
      success: true,
      message: threadId, // Return threadId in message for frontend tracking
      count: 0,
    };
  } catch (error) {
    console.error("Error generating therapy research:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to generate research",
      count: 0,
    };
  }
};
