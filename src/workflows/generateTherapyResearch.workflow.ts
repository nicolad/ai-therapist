import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createResearchGroundingScorer } from "@/src/mastra/scorers";
import {
  createFaithfulnessScorer,
  createHallucinationScorer,
  createCompletenessScorer,
  createContextRelevanceScorerLLM,
} from "@mastra/evals/scorers/prebuilt";
import { tursoTools } from "@/src/db";
import { ragTools } from "@/src/mastra/tools/rag.tools";
import { sourceTools } from "@/src/mastra/tools/sources.tools";
import { extractorTools } from "@/src/mastra/tools/extractor.tools";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

/**
 * Deep Research Workflow
 *
 * Multi-step workflow with eval-gated quality control:
 * 1. Load goal + notes from Turso
 * 2. Plan query (goal type + keywords)
 * 3. Multi-source search (Crossref, PubMed, Semantic Scholar)
 * 4. Extract + gate each candidate with scorers
 * 5. Repair failed extractions once
 * 6. Persist top results + embed into Turso vectors
 */

// Input/Output schemas
const inputSchema = z.object({
  userId: z.string(),
  goalId: z.number().int(),
});

const outputSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  count: z.number().int(),
});

// Step 1: Load context
const loadContextStep = createStep({
  id: "load-context",
  inputSchema,
  outputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.object({
      id: z.number().int(),
      title: z.string(),
      description: z.string().nullable(),
    }),
    notes: z.array(z.object({ id: z.number().int(), content: z.string() })),
  }),
  execute: async ({ inputData }) => {
    const goal = await tursoTools.getGoal(inputData.goalId, inputData.userId);
    const notes = await tursoTools.listNotesForEntity(
      inputData.goalId,
      "Goal",
      inputData.userId,
    );

    return {
      userId: inputData.userId,
      goalId: inputData.goalId,
      goal: {
        id: goal.id,
        title: goal.title,
        description: goal.description,
      },
      notes: notes.map((n) => ({ id: n.id, content: n.content })),
    };
  },
});

// Step 2: Plan query
const planQueryStep = createStep({
  id: "plan-query",
  inputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.object({ title: z.string(), description: z.string().nullable() }),
    notes: z.array(z.object({ content: z.string() })),
  }),
  outputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.object({ title: z.string(), description: z.string().nullable() }),
    notes: z.array(z.object({ content: z.string() })),
    therapeuticGoalType: z.string(),
    keywords: z.array(z.string()),
    inclusion: z.array(z.string()),
    exclusion: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    const plan = await extractorTools.plan({
      title: inputData.goal.title,
      description: inputData.goal.description ?? "",
      notes: inputData.notes.map((n) => n.content),
    });

    return {
      ...inputData,
      ...plan,
    };
  },
});

// Step 3: Multi-source search
const searchStep = createStep({
  id: "search",
  inputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.any(),
    notes: z.any(),
    therapeuticGoalType: z.string(),
    keywords: z.array(z.string()),
  }),
  outputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.any(),
    notes: z.any(),
    therapeuticGoalType: z.string(),
    keywords: z.array(z.string()),
    candidates: z.array(
      z.object({
        title: z.string(),
        doi: z.string().optional(),
        url: z.string().optional(),
        year: z.number().int().optional(),
        source: z.string(),
      }),
    ),
  }),
  execute: async ({ inputData }) => {
    const q = inputData.keywords.join(" ");

    // Parallel search across sources
    const [crossref, pubmed, semantic] = await Promise.all([
      sourceTools.searchCrossref(q, 15),
      sourceTools.searchPubMed(q, 15),
      sourceTools.searchSemanticScholar(q, 15),
    ]);

    const candidates = sourceTools.dedupeCandidates([
      ...crossref,
      ...pubmed,
      ...semantic,
    ]);

    return {
      ...inputData,
      candidates,
    };
  },
});

// Step 4: Extract one paper with eval gating
const extractOneStep = createStep({
  id: "extract-one",
  inputSchema: z.object({
    candidate: z.object({
      title: z.string(),
      doi: z.string().optional(),
      url: z.string().optional(),
      year: z.number().int().optional(),
      source: z.string(),
    }),
    therapeuticGoalType: z.string(),
    goalTitle: z.string(),
    goalDescription: z.string().nullable(),
  }),
  outputSchema: z.object({
    ok: z.boolean(),
    score: z.number(),
    research: z.any().optional(),
    reason: z.string().optional(),
  }),
  scorers: {
    faithfulness: {
      scorer: createFaithfulnessScorer({
        model: deepseek("deepseek-chat"),
      }),
      sampling: { type: "ratio", rate: 1 },
    },
    hallucination: {
      scorer: createHallucinationScorer({
        model: deepseek("deepseek-chat"),
      }),
      sampling: { type: "ratio", rate: 1 },
    },
    completeness: {
      scorer: createCompletenessScorer(),
      sampling: { type: "ratio", rate: 1 },
    },
  },
  execute: async ({ inputData }) => {
    // 1. Fetch paper details
    const paper = await sourceTools.fetchPaperDetails(inputData.candidate);

    // 2. Extract structured JSON
    const extracted = await extractorTools.extract({
      therapeuticGoalType: inputData.therapeuticGoalType,
      goalTitle: inputData.goalTitle,
      goalDescription: inputData.goalDescription ?? "",
      paper,
    });

    // 3. Gating scorer (synchronous double-check)
    const groundingScorer = createResearchGroundingScorer();
    const gating = await groundingScorer.run({
      input: `Goal: ${inputData.goalTitle}`,
      output: extracted,
      context: paper.abstract ?? "",
    } as any);

    const score = gating.score; // 0..1
    const threshold = 0.8;
    const ok = score >= threshold;

    if (!ok) {
      // Repair pass
      const repaired = await extractorTools.repair({
        extracted,
        abstract: paper.abstract ?? "",
        feedback: gating.reason ?? "Unsupported claims detected",
      });

      // Re-score
      const gating2 = await groundingScorer.run({
        input: `Goal: ${inputData.goalTitle}`,
        output: repaired,
        context: paper.abstract ?? "",
      } as any);

      const score2 = gating2.score;
      const ok2 = score2 >= threshold;

      if (!ok2) {
        return {
          ok: false,
          score: score2,
          reason: `Failed after repair: ${gating2.reason}`,
        };
      }

      return {
        ok: true,
        score: score2,
        research: { ...repaired, extractionConfidence: score2 },
        reason: `Repaired successfully: ${gating2.reason}`,
      };
    }

    return {
      ok: true,
      score,
      research: { ...extracted, extractionConfidence: score },
      reason: gating.reason,
    };
  },
});

// Step 5: Extract all candidates
const extractAllStep = createStep({
  id: "extract-all",
  inputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    context: z.any(),
    plan: z.any(),
    search: z.any(),
  }),
  outputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    results: z.array(z.any()),
  }),
  execute: async ({ inputData }) => {
    const goal = inputData.context.goal;
    const plan = inputData.plan;
    const candidates = inputData.search.candidates.slice(0, 30); // Top 30

    const results = [];

    // Process in batches of 6
    for (let i = 0; i < candidates.length; i += 6) {
      const batch = candidates.slice(i, i + 6);

      const batchResults = await Promise.all(
        batch.map((candidate: any) =>
          extractOneStep.execute!({
            inputData: {
              candidate,
              therapeuticGoalType: plan.therapeuticGoalType,
              goalTitle: goal.title,
              goalDescription: goal.description,
            },
            context: {},
            tools: {},
          } as any),
        ),
      );

      results.push(...batchResults);
    }

    return {
      userId: inputData.userId,
      goalId: inputData.goalId,
      results,
    };
  },
});

// Step 6: Persist results + embed
const persistStep = createStep({
  id: "persist",
  inputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    results: z.array(z.any()),
  }),
  outputSchema,
  execute: async ({ inputData }) => {
    const good = inputData.results
      .filter((r) => r.ok && r.research)
      .sort((a, b) => b.score - a.score);

    // Take top 12 high-confidence papers
    const top = good.slice(0, 12);
    let count = 0;

    for (const r of top) {
      // Persist to DB
      const rowId = await tursoTools.upsertTherapyResearch(
        inputData.goalId,
        inputData.userId,
        r.research,
      );
      count++;

      // Embed into vectors
      await ragTools.upsertResearchChunks({
        goalId: inputData.goalId,
        entityType: "TherapyResearch",
        entityId: rowId,
        title: r.research.title,
        abstract: r.research.abstract ?? "",
        keyFindings: r.research.keyFindings,
        techniques: r.research.therapeuticTechniques,
      });
    }

    return {
      success: true,
      count,
      message: count
        ? `Generated ${count} high-confidence research papers`
        : "No high-confidence research found",
    };
  },
});

// Build workflow
export const generateTherapyResearchWorkflow = createWorkflow({
  id: "generate-therapy-research",
  inputSchema,
  outputSchema,
})
  .then(loadContextStep)
  .then(planQueryStep)
  .then(searchStep)
  .then(
    createStep({
      id: "prep-extract",
      inputSchema: z.any(),
      outputSchema: z.any(),
      execute: async ({ inputData }) => ({
        userId: inputData.userId,
        goalId: inputData.goalId,
        context: {
          goal: inputData.goal,
          notes: inputData.notes,
        },
        plan: {
          therapeuticGoalType: inputData.therapeuticGoalType,
          keywords: inputData.keywords,
        },
        search: {
          candidates: inputData.candidates,
        },
      }),
    }),
  )
  .then(extractAllStep)
  .then(persistStep)
  .commit();
