import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { d1Tools } from "@/src/db";
import { ragTools } from "@/src/tools/rag.tools";
import { sourceTools } from "@/src/tools/sources.tools";
import { extractorTools } from "@/src/tools/extractor.tools";
import { openAlexTools } from "@/src/tools/openalex.tools";
import { langfusePromptPackTools } from "@/src/tools/langfusePromptPack.tools";

/**
 * Deep Research Workflow
 *
 * Multi-step workflow with quality gating:
 * 1. Load goal + notes from D1 database
 * 2. Ensure Langfuse prompts exist (DeepSeek generates goal-specific templates)
 * 3. Plan query (goal type + keywords + multi-source query expansion)
 * 4. Multi-source search (Crossref, PubMed, Semantic Scholar)
 * 5. Enrich abstracts via OpenAlex (controlled concurrency)
 * 6. Extract + gate each candidate (batch processing with per-candidate error handling)
 * 7. Persist top results to D1 database + vector store
 */

// Tunable constants
const ENRICH_CANDIDATES_LIMIT = 300;
const ENRICH_CONCURRENCY = 15;
const EXTRACT_CANDIDATES_LIMIT = 50;
const EXTRACTION_BATCH_SIZE = 6;
const PERSIST_CANDIDATES_LIMIT = 50;
const RELEVANCE_THRESHOLD = 0.6;
const CONFIDENCE_THRESHOLD = 0.5;
const BLENDED_THRESHOLD = 0.45;

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

// Step 3: Plan query (uses Langfuse-backed planner prompt)
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
        "behavioral_change",
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
    const crossrefQueries = inputData.crossrefQueries?.length
      ? inputData.crossrefQueries.slice(0, 15)
      : [
          "evidence-based therapy intervention",
          "behavioral change psychological treatment",
          "cognitive behavioral therapy techniques",
          "emotional regulation therapeutic approach",
          "psychological resilience building",
        ];

    const semanticQueries = inputData.semanticScholarQueries?.length
      ? inputData.semanticScholarQueries.slice(0, 20)
      : [
          "evidence-based psychological intervention",
          "behavioral change therapy outcomes",
          "cognitive behavioral treatment effectiveness",
          "emotional regulation therapy",
          "therapeutic techniques mental health",
        ];

    const pubmedQueries = inputData.pubmedQueries?.length
      ? inputData.pubmedQueries.slice(0, 12)
      : [
          "psychological therapy intervention outcomes",
          "behavioral treatment evidence-based",
        ];

    console.log(`   Crossref: ${crossrefQueries.length} queries`);
    console.log(`   Semantic Scholar: ${semanticQueries.length} queries`);
    console.log(`   PubMed: ${pubmedQueries.length} queries\n`);

    // Sequential with delays to respect free-tier API rate limits
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    console.log("Fetching Crossref results...");
    const crossrefBatches: any[][] = [];
    for (const q of crossrefQueries) {
      crossrefBatches.push(await sourceTools.searchCrossref(q, PER_QUERY));
      await delay(500);
    }

    console.log("Fetching PubMed results...");
    const pubmedBatches: any[][] = [];
    for (const q of pubmedQueries) {
      pubmedBatches.push(await sourceTools.searchPubMed(q, PER_QUERY));
      await delay(1000); // NCBI rate limit: 3 req/sec without API key
    }

    console.log("Fetching Semantic Scholar results...");
    const semanticBatches: any[][] = [];
    for (const q of semanticQueries) {
      semanticBatches.push(
        await sourceTools.searchSemanticScholar(q, PER_QUERY),
      );
      await delay(1000); // Semantic Scholar: 100 req/5 min
    }

    const combined = [
      ...crossrefBatches.flat(),
      ...pubmedBatches.flat(),
      ...semanticBatches.flat(),
    ];

    console.log(
      `📚 Raw results: Crossref(${crossrefBatches.flat().length}), PubMed(${pubmedBatches.flat().length}), Semantic(${semanticBatches.flat().length})`,
    );

    // Title blacklist: avoid obvious out-of-domain papers
    const badTerms = [
      "forensic",
      "witness",
      "court",
      "police",
      "legal",
      "abuse",
      "occupational therapy",
      "pre-admission",
    ];

    const bad = new RegExp(
      `\\b(${badTerms.map(escapeRegExp).join("|")})\\b`,
      "i",
    );

    const deduped = sourceTools.dedupeCandidates(combined);
    const titleFiltered = deduped.filter((c: any) => {
      const title = c.title ?? "";
      return !bad.test(title);
    });

    console.log(`🔗 After dedup: ${deduped.length} candidates`);
    console.log(`🚫 After title filter: ${titleFiltered.length} candidates`);

    // Filter book chapters but keep candidates without abstracts (enriched next)
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

// Step 5: Enrich abstracts from OpenAlex (controlled concurrency)
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

    const slice = candidates.slice(0, ENRICH_CANDIDATES_LIMIT);

    // Use mapLimit to cap concurrent OpenAlex requests
    const enriched = await sourceTools.mapLimit(
      slice,
      ENRICH_CONCURRENCY,
      async (c: any, idx: number) => {
        const doi = (c.doi ?? "").toString().trim();
        if (!doi || c.abstract) {
          return c;
        }

        if (idx > 0 && idx % 50 === 0) {
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
        } catch {
          return c;
        }
      },
    );

    const withAbstracts = enriched.filter(
      (c: any) => (c.abstract || c._enrichedAbstract || "").length >= 150,
    );

    console.log(`   Enriched: ${enriched.length} candidates`);
    console.log(`   With abstracts (≥150 chars): ${withAbstracts.length}\n`);

    return {
      ...inputData,
      candidates: [
        ...withAbstracts,
        ...candidates.slice(ENRICH_CANDIDATES_LIMIT),
      ],
    };
  },
});

// Plain async function for single-paper extraction.
// Not a Mastra step — avoids the `step.execute!()` anti-pattern.
async function extractOnePaper(params: {
  candidate: {
    title: string;
    doi?: string;
    url?: string;
    year?: number;
    source: string;
    [key: string]: any;
  };
  goalType: string;
  goalTitle: string;
  goalDescription: string | null;
  extractorPromptName: string;
}): Promise<{ ok: boolean; score: number; research?: any; reason: string }> {
  try {
    const paper = await sourceTools.fetchPaperDetails(params.candidate);

    const extracted = await extractorTools.extract({
      goalTitle: params.goalTitle,
      goalDescription: params.goalDescription ?? "",
      goalType: params.goalType,
      paper,
      extractorPromptName: params.extractorPromptName,
    });

    const ok =
      extracted.relevanceScore >= RELEVANCE_THRESHOLD &&
      extracted.confidence >= CONFIDENCE_THRESHOLD &&
      (extracted.keyFindings?.length ?? 0) > 0;

    return {
      ok,
      score: extracted.relevanceScore,
      research: ok
        ? {
            // Map to DB schema
            therapeuticGoalType: params.goalType,
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
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`Extraction error for "${params.candidate.title}": ${msg}`);
    return { ok: false, score: 0, reason: "extraction_error" };
  }
}

// Step 6: Reshape data for the extraction step
const prepExtractStep = createStep({
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
});

// Step 7: Extract all candidates in batches
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
    const candidates = inputData.search.candidates.slice(
      0,
      EXTRACT_CANDIDATES_LIMIT,
    );

    console.log(
      `\n🧠 Extracting ${candidates.length} candidates (batches of ${EXTRACTION_BATCH_SIZE})...\n`,
    );

    const results: any[] = [];

    for (let i = 0; i < candidates.length; i += EXTRACTION_BATCH_SIZE) {
      const batch = candidates.slice(i, i + EXTRACTION_BATCH_SIZE);
      const batchNum = Math.floor(i / EXTRACTION_BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(candidates.length / EXTRACTION_BATCH_SIZE);

      console.log(
        `   Batch ${batchNum}/${totalBatches} (candidates ${i + 1}-${Math.min(i + EXTRACTION_BATCH_SIZE, candidates.length)})`,
      );

      const batchResults = await Promise.all(
        batch.map((candidate: any) =>
          extractOnePaper({
            candidate,
            goalType: plan.goalType,
            goalTitle: goal.title,
            goalDescription: goal.description,
            extractorPromptName: plan.extractorPromptName,
          }),
        ),
      );

      results.push(...batchResults);
    }

    const passed = results.filter((r) => r.ok).length;
    console.log(
      `\n   Extraction complete: ${passed}/${results.length} passed initial gate\n`,
    );

    return {
      userId: inputData.userId,
      goalId: inputData.goalId,
      results,
    };
  },
});

// Step 8: Persist results with two-stage quality gating
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

    // Stage 1: must have at least one key finding
    // Stage 2: rank by blended score (70% relevance + 30% confidence), take top N
    const qualified = inputData.results
      .filter((r) => r.ok && r.research)
      .filter((r) => (r.research.keyFindings?.length ?? 0) > 0)
      .map((r) => {
        const relevance = r.research.relevanceScore ?? 0;
        const confidence = r.research.extractionConfidence ?? 0;
        const blended = 0.7 * relevance + 0.3 * confidence;
        return { ...r, blended };
      })
      .filter((r) => r.blended >= BLENDED_THRESHOLD)
      .sort((a, b) => b.blended - a.blended);

    console.log(
      `   With key findings + blended ≥ ${BLENDED_THRESHOLD}: ${qualified.length}`,
    );

    const top = qualified.slice(0, PERSIST_CANDIDATES_LIMIT);

    console.log(`\n🎯 Persisting top ${top.length} papers:\n`);

    let count = 0;
    let errors = 0;

    for (const r of top) {
      const research = r.research;
      const displayTitle =
        research.title.length > 80
          ? `${research.title.substring(0, 80)}…`
          : research.title;

      console.log(
        `   ${count + errors + 1}. [${r.blended.toFixed(2)}] ${displayTitle}`,
      );

      try {
        const rowId = await d1Tools.upsertTherapyResearch(
          inputData.goalId,
          inputData.userId,
          research,
        );
        count++;

        await ragTools.upsertResearchChunks({
          goalId: inputData.goalId,
          entityType: "TherapyResearch",
          entityId: rowId,
          title: research.title,
          abstract: research.abstract ?? "",
          keyFindings: research.keyFindings,
          techniques: research.therapeuticTechniques,
        });
      } catch (err) {
        errors++;
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`   ⚠️  Failed to persist "${research.title}": ${msg}`);
      }
    }

    console.log(
      `\n✨ Persisted ${count} papers${errors > 0 ? `, ${errors} failed` : ""}\n`,
    );

    return {
      success: count > 0 || errors === 0,
      count,
      message: count
        ? `Generated ${count} research papers (blended quality score ≥ ${BLENDED_THRESHOLD}, ranked by relevance)`
        : errors > 0
          ? `All ${errors} persist attempts failed`
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
  .then(prepExtractStep)
  .then(extractAllStep)
  .then(persistStep)
  .commit();
