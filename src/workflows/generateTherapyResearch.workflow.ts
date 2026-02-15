import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createResearchGroundingScorer } from "@/src/scorers";
import {
  createFaithfulnessScorer,
  createHallucinationScorer,
  createCompletenessScorer,
  createContextRelevanceScorerLLM,
} from "@mastra/evals/scorers/prebuilt";
import { d1Tools } from "@/src/db";
import { ragTools } from "@/src/tools/rag.tools";
import { sourceTools } from "@/src/tools/sources.tools";
import { extractorTools } from "@/src/tools/extractor.tools";
import { openAlexTools } from "@/src/tools/openalex.tools";
import { langfusePromptPackTools } from "@/src/tools/langfusePromptPack.tools";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

/**
 * Deep Research Workflow
 *
 * Multi-step workflow with eval-gated quality control:
 * 1. Load goal + notes from D1 database
 * 2. Plan query (goal type + keywords)
 * 3. Multi-source search (Crossref, PubMed, Semantic Scholar)
 * 4. Extract + gate each candidate with scorers
 * 5. Repair failed extractions once
 * 6. Persist top results to D1 database
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
    const goal = await d1Tools.getGoal(inputData.goalId, inputData.userId);
    const notes = await d1Tools.listNotesForEntity(
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

// Step 2: Ensure Langfuse prompts exist (DeepSeek generates goal-specific templates)
const ensurePromptsStep = createStep({
  id: "ensure-langfuse-prompts",
  inputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.object({
      id: z.number().int(),
      title: z.string(),
      description: z.string().nullable(),
    }),
    notes: z.array(z.object({ id: z.number().int(), content: z.string() })),
  }),
  outputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.object({
      id: z.number().int(),
      title: z.string(),
      description: z.string().nullable(),
    }),
    notes: z.array(z.object({ content: z.string() })),
    plannerPromptName: z.string(),
    extractorPromptName: z.string(),
    goalSignature: z.string(),
    createdNewVersion: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    const ensured = await langfusePromptPackTools.ensure({
      goalId: inputData.goalId,
      goalTitle: inputData.goal.title,
      goalDescription: inputData.goal.description ?? "",
      notes: inputData.notes.map((n) => n.content),
      label: process.env.LANGFUSE_PROMPT_LABEL || "production",
    });

    return {
      ...inputData,
      notes: inputData.notes.map((n) => ({ content: n.content })),
      ...ensured,
    };
  },
});

// Step 3: Plan query (now uses Langfuse-backed planner prompt)
const planQueryStep = createStep({
  id: "plan-query",
  inputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.object({ title: z.string(), description: z.string().nullable() }),
    notes: z.array(z.object({ content: z.string() })),
    plannerPromptName: z.string(),
    extractorPromptName: z.string(),
  }),
  outputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.object({ title: z.string(), description: z.string().nullable() }),
    notes: z.array(z.object({ content: z.string() })),
    plannerPromptName: z.string(),
    extractorPromptName: z.string(),
    goalType: z.string(),
    keywords: z.array(z.string()),
    semanticScholarQueries: z.array(z.string()),
    crossrefQueries: z.array(z.string()),
    pubmedQueries: z.array(z.string()),
    inclusion: z.array(z.string()),
    exclusion: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    const rawPlan = await extractorTools.plan({
      title: inputData.goal.title,
      description: inputData.goal.description ?? "",
      notes: inputData.notes.map((n) => n.content),
      plannerPromptName: inputData.plannerPromptName,
      timeHorizonDays: 14,
      roleFamily: "software engineering",
    });

    // Sanitize to remove "occupational therapy" poison
    const plan = extractorTools.sanitize(rawPlan);

    console.log(`\n📋 Query Plan:`);
    console.log(`   Goal Type: ${plan.goalType ?? plan.therapeuticGoalType}`);
    console.log(
      `   Semantic Scholar Queries: ${plan.semanticScholarQueries?.length ?? 0}`,
    );
    console.log(`   Crossref Queries: ${plan.crossrefQueries?.length ?? 0}`);
    console.log(`   PubMed Queries: ${plan.pubmedQueries?.length ?? 0}\n`);

    return {
      ...inputData,
      ...plan,
      goalType:
        plan.goalType ??
        plan.therapeuticGoalType ??
        "career_interview_self_advocacy",
    };
  },
});

/**
 * Escape special regex characters
 */
function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Step 4: Multi-source search with multi-query expansion
const searchStep = createStep({
  id: "search",
  inputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.any(),
    notes: z.any(),
    plannerPromptName: z.string(),
    extractorPromptName: z.string(),
    goalType: z.string(),
    keywords: z.array(z.string()),
    semanticScholarQueries: z.array(z.string()).optional(),
    crossrefQueries: z.array(z.string()).optional(),
    pubmedQueries: z.array(z.string()).optional(),
    exclusion: z.array(z.string()).optional(),
  }),
  outputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.any(),
    notes: z.any(),
    plannerPromptName: z.string(),
    extractorPromptName: z.string(),
    goalType: z.string(),
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
    // Increase recall aggressively; filter later
    const PER_QUERY = 50;

    console.log(`\n🔍 Multi-source search with query expansion...\n`);

    // Fallback queries if planner didn't provide them
    const defaultQuery = inputData.keywords.join(" ");
    const crossrefQueries = inputData.crossrefQueries?.length
      ? inputData.crossrefQueries.slice(0, 15)
      : [
          "job interview self advocacy",
          "employment interview self presentation",
          "interview impression management",
          "interview communication skills training",
          "job interview confidence building",
        ];

    const semanticQueries = inputData.semanticScholarQueries?.length
      ? inputData.semanticScholarQueries.slice(0, 20)
      : [
          "job interview self advocacy",
          "employment interview self presentation strategies",
          "interview impression management",
          "job interview communication training",
          "self promotion in job interviews",
        ];

    const pubmedQueries = inputData.pubmedQueries?.length
      ? inputData.pubmedQueries.slice(0, 12)
      : [
          "job interview anxiety intervention",
          "employment interview communication skills",
        ];

    console.log(`   Crossref: ${crossrefQueries.length} queries`);
    console.log(`   Semantic Scholar: ${semanticQueries.length} queries`);
    console.log(`   PubMed: ${pubmedQueries.length} queries\n`);

    // Execute queries with rate limiting (sequential with delays)
    // to avoid overwhelming free APIs
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    console.log("Fetching Crossref results...");
    const crossrefBatches: any[][] = [];
    for (const q of crossrefQueries) {
      crossrefBatches.push(await sourceTools.searchCrossref(q, PER_QUERY));
      await delay(500); // 500ms between Crossref requests
    }

    console.log("Fetching PubMed results...");
    const pubmedBatches: any[][] = [];
    for (const q of pubmedQueries) {
      pubmedBatches.push(await sourceTools.searchPubMed(q, PER_QUERY));
      await delay(1000); // 1s between PubMed requests (NCBI rate limit: 3/sec without API key)
    }

    console.log("Fetching Semantic Scholar results...");
    const semanticBatches: any[][] = [];
    for (const q of semanticQueries) {
      semanticBatches.push(
        await sourceTools.searchSemanticScholar(q, PER_QUERY),
      );
      await delay(1000); // 1s between Semantic Scholar requests (rate limit: 100/5min)
    }

    const combined = [
      ...crossrefBatches.flat(),
      ...pubmedBatches.flat(),
      ...semanticBatches.flat(),
    ];

    console.log(
      `📚 Raw results: Crossref(${crossrefBatches.flat().length}), PubMed(${pubmedBatches.flat().length}), Semantic(${semanticBatches.flat().length})`,
    );

    // Light title blacklist (avoid obvious wrong-domain papers)
    const badTerms = [
      "forensic",
      "witness",
      "court",
      "police",
      "legal",
      "child",
      "abuse",
      "medical",
      "occupational therapy", // poison term
      "pre-admission",
      "intake interview",
      "diagnostic interview",
      "therapy session",
      "treatment outcome",
      "clinical interview",
      "patient interview",
      "counseling interview",
      "motivational interview",
      "therapeutic alliance",
    ];

    const bad = new RegExp(
      `\\b(${badTerms.map(escapeRegExp).join("|")})\\b`,
      "i",
    );

    // Require at least ONE of these terms for job interview domain
    const requiredTerms = [
      "job interview",
      "employment interview",
      "selection interview",
      "hiring interview",
      "interview self",
      "interview presentation",
      "interview impression",
      "interview communication",
      "interview confidence",
      "interview skills",
      "interview training",
      "interview preparation",
      "interview performance",
      "applicant",
    ];

    const required = new RegExp(
      `\\b(${requiredTerms.map(escapeRegExp).join("|")})`,
      "i",
    );

    const deduped = sourceTools.dedupeCandidates(combined);
    const titleFiltered = deduped.filter((c: any) => {
      const title = c.title ?? "";
      // Must NOT contain bad terms AND must contain at least one required term
      return !bad.test(title) && required.test(title);
    });

    console.log(`🔗 After dedup: ${deduped.length} candidates`);
    console.log(`🚫 After title filter: ${titleFiltered.length} candidates`);

    // DON'T filter on abstract length yet - we'll enrich them next!
    // Only filter book chapters
    const filtered = sourceTools.filterBookChapters(titleFiltered);

    console.log(
      `✅ After book chapter filter: ${filtered.length} candidates\n`,
    );

    return {
      ...inputData,
      candidates: filtered,
    };
  },
});

// Step 5: Enrich abstracts from OpenAlex
const enrichAbstractsStep = createStep({
  id: "enrich-abstracts",
  inputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.any(),
    notes: z.any(),
    plannerPromptName: z.string(),
    extractorPromptName: z.string(),
    goalType: z.string(),
    keywords: z.array(z.string()),
    candidates: z.array(z.any()),
  }),
  outputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    goal: z.any(),
    notes: z.any(),
    plannerPromptName: z.string(),
    extractorPromptName: z.string(),
    goalType: z.string(),
    keywords: z.array(z.string()),
    candidates: z.array(z.any()),
  }),
  execute: async ({ inputData }) => {
    const candidates = inputData.candidates;

    console.log(`\n🔬 Enriching abstracts from OpenAlex...\n`);

    // Enrich top 300 candidates (avoid hammering OpenAlex)
    const N = 300;
    const slice = candidates.slice(0, N);

    const enriched = await Promise.all(
      slice.map(async (c: any, idx: number) => {
        const doi = (c.doi ?? "").toString().trim();
        if (!doi || c.abstract) {
          // Already has abstract or no DOI
          return c;
        }

        if (idx % 50 === 0 && idx > 0) {
          console.log(`   Enriched ${idx} / ${slice.length}...`);
        }

        try {
          const oa = await openAlexTools.fetchAbstractByDoi(doi);

          return {
            ...c,
            _enrichedAbstract: oa.abstract,
            _enrichedYear: oa.year,
            _enrichedVenue: oa.venue,
            _enrichedAuthors: oa.authors,
          };
        } catch (err) {
          return c;
        }
      }),
    );

    const withAbstracts = enriched.filter(
      (c: any) => (c.abstract || c._enrichedAbstract || "").length >= 150,
    );

    console.log(`   Enriched: ${enriched.length} candidates`);
    console.log(`   With abstracts (≥150 chars): ${withAbstracts.length}\n`);

    return {
      ...inputData,
      candidates: [...withAbstracts, ...candidates.slice(N)],
    };
  },
});

// Step 6: Extract one paper with Langfuse-backed extraction
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
    goalType: z.string(),
    goalTitle: z.string(),
    goalDescription: z.string().nullable(),
    extractorPromptName: z.string(),
  }),
  outputSchema: z.object({
    ok: z.boolean(),
    score: z.number(),
    research: z.any().optional(),
    reason: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    // 1. Fetch paper details
    const paper = await sourceTools.fetchPaperDetails(inputData.candidate);

    // 2. Extract structured JSON using Langfuse-backed prompt
    const extracted = await extractorTools.extract({
      goalTitle: inputData.goalTitle,
      goalDescription: inputData.goalDescription ?? "",
      goalType: inputData.goalType,
      paper,
      extractorPromptName: inputData.extractorPromptName,
    });

    // 3. Hard gating based on extractor output
    const ok =
      extracted.relevanceScore >= 0.6 &&
      extracted.confidence >= 0.5 &&
      (extracted.keyFindings?.length ?? 0) > 0;

    return {
      ok,
      score: extracted.relevanceScore,
      research: ok
        ? {
            // Map to legacy schema for backward compatibility
            therapeuticGoalType: inputData.goalType,
            title: extracted.paperMeta.title,
            authors: extracted.paperMeta.authors,
            year: extracted.paperMeta.year,
            journal: extracted.paperMeta.venue,
            doi: extracted.paperMeta.doi,
            url: extracted.paperMeta.url,
            abstract: paper.abstract,
            keyFindings: extracted.keyFindings,
            therapeuticTechniques: extracted.practicalTakeaways,
            evidenceLevel: extracted.studyType,
            relevanceScore: extracted.relevanceScore,
            extractionConfidence: extracted.confidence,
            extractedBy: "mastra:deepseek-langfuse:v2",
          }
        : undefined,
      reason: ok ? "passed" : (extracted.rejectReason ?? "failed_thresholds"),
    };
  },
});

// Step 7: Extract all candidates
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
              goalType: plan.goalType,
              goalTitle: goal.title,
              goalDescription: goal.description,
              extractorPromptName: plan.extractorPromptName,
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

// Step 8: Persist results with two-stage gating
const persistStep = createStep({
  id: "persist",
  inputSchema: z.object({
    userId: z.string(),
    goalId: z.number().int(),
    results: z.array(z.any()),
  }),
  outputSchema,
  execute: async ({ inputData }) => {
    console.log(`\n📊 Extraction results: ${inputData.results.length} total\n`);

    // Two-stage gating approach:
    // Stage 1: Loose filter - must have key findings
    // Stage 2: Rank by blended score and take top 50

    const withFindings = inputData.results
      .filter((r) => r.ok && r.research)
      .filter((r) => {
        const research = r.research;

        // Must have at least one key finding
        if (!research.keyFindings || research.keyFindings.length === 0) {
          return false;
        }

        return true;
      })
      .map((r) => {
        // Calculate blended score: 70% relevance + 30% extraction confidence
        const relevance = r.research.relevanceScore ?? 0;
        const confidence = r.research.extractionConfidence ?? 0;
        const blended = 0.7 * relevance + 0.3 * confidence;

        return {
          ...r,
          blended,
        };
      })
      .filter((r) => r.blended >= 0.45) // Looser threshold for volume
      .sort((a, b) => b.blended - a.blended);

    console.log(`   With key findings: ${withFindings.length}`);
    console.log(
      `   Above quality threshold (blended ≥ 0.45): ${withFindings.length}\n`,
    );

    // Take top 50 (or whatever we have)
    const target = Math.min(50, withFindings.length);
    const top = withFindings.slice(0, target);

    console.log(`🎯 Targeting top ${target} papers:\n`);

    let count = 0;
    for (const r of top) {
      const research = r.research;

      console.log(
        `   ${count + 1}. [${r.blended.toFixed(2)}] ${research.title.substring(0, 80)}...`,
      );

      // Persist to DB
      const rowId = await d1Tools.upsertTherapyResearch(
        inputData.goalId,
        inputData.userId,
        research,
      );
      count++;

      // Embed into vectors
      await ragTools.upsertResearchChunks({
        goalId: inputData.goalId,
        entityType: "TherapyResearch",
        entityId: rowId,
        title: research.title,
        abstract: research.abstract ?? "",
        keyFindings: research.keyFindings,
        techniques: research.therapeuticTechniques,
      });
    }

    console.log(`\n✨ Persisted ${count} papers to database\n`);

    return {
      success: true,
      count,
      message: count
        ? `Generated ${count} research papers (blended quality score ≥ 0.45, ranked by relevance)`
        : "No papers met minimum quality thresholds",
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
  .then(ensurePromptsStep)
  .then(planQueryStep)
  .then(searchStep)
  .then(enrichAbstractsStep)
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
          goalType: inputData.goalType,
          extractorPromptName: inputData.extractorPromptName,
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
