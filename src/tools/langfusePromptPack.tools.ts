import { Langfuse } from "langfuse";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateObject } from "ai";
import { z } from "zod";
import crypto from "node:crypto";

const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY });

const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.LANGFUSE_BASE_URL,
});

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

// Bump this to force prompt regeneration for all goals when templates change
const PROMPT_TEMPLATE_VERSION = "v2-generic-therapy";

function extractVars(template: string): string[] {
  const vars = new Set<string>();
  const re = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(template))) vars.add(m[1]);
  return [...vars];
}

function assertOnlyAllowedVars(
  template: string,
  allowed: string[],
  where: string,
) {
  const used = extractVars(template);
  const allowedSet = new Set(allowed);
  const unknown = used.filter((v) => !allowedSet.has(v));
  if (unknown.length) {
    throw new Error(
      `[${where}] Unknown Langfuse variables: ${unknown.join(", ")}. Allowed: ${allowed.join(", ")}`,
    );
  }
}

const PromptPackSchema = z.object({
  plannerPrompt: z.string().min(200),
  extractorPrompt: z.string().min(200),
});

type PromptPack = z.infer<typeof PromptPackSchema>;

export type PromptRef = { name: string; version: number; label: string };
export type GoalPromptPack = {
  fingerprint: string;
  label: string;
  planner: PromptRef;
  extractor: PromptRef;
  repair: PromptRef;
};

async function safeGetTextPrompt(
  name: string,
  label: string,
): Promise<any | null> {
  try {
    // Langfuse returns latest version by default.
    return await langfuse.getPrompt(name, undefined, { type: "text", label });
  } catch {
    return null;
  }
}

function ensureMetaLine(template: string, metaLine: string): string {
  if (template.includes(metaLine)) return template;
  return `${template}\n\n${metaLine}\n`;
}

async function upsertLangfuseTextPrompt(params: {
  name: string;
  prompt: string;
  label: string;
}) {
  const { name, prompt, label } = params;

  try {
    // Some Langfuse setups treat this as "create or create new version".
    await langfuse.createPrompt({
      name,
      prompt,
      labels: [label],
      isActive: true,
    });
    return;
  } catch (err: any) {
    // If the SDK exposes createPromptVersion, use it as a safe fallback.
    const lfAny = langfuse as any;
    if (typeof lfAny.createPromptVersion === "function") {
      await lfAny.createPromptVersion({
        name,
        prompt,
        labels: [label],
        isActive: true,
      });
      return;
    }
    throw err;
  }
}

/**
 * Ensures goal-specific prompts exist in Langfuse.
 * - If missing OR signature mismatch => generate with OpenAI + create new prompt version.
 * - Else reuse existing latest version.
 */
export async function ensureLangfusePromptPackForGoal(params: {
  goalId: number;
  goalTitle: string;
  goalDescription: string;
  notes: string[];
  label?: string; // e.g. "production" | "staging"
}) {
  const {
    goalId,
    goalTitle,
    goalDescription,
    notes,
    label = "production",
  } = params;

  const goalSignature = sha256(
    JSON.stringify({
      goalId,
      goalTitle,
      goalDescription,
      notes,
      PROMPT_TEMPLATE_VERSION,
    }),
  );

  const plannerName = `research.plan.goal_${goalId}`;
  const extractorName = `research.extract.goal_${goalId}`;
  const metaLine = `META_GOAL_SIGNATURE=${goalSignature}`;

  const existingPlanner = await safeGetTextPrompt(plannerName, label);
  const existingExtractor = await safeGetTextPrompt(extractorName, label);

  const plannerOk = Boolean(existingPlanner?.prompt?.includes(metaLine));
  const extractorOk = Boolean(existingExtractor?.prompt?.includes(metaLine));

  if (plannerOk && extractorOk) {
    console.log("✅ Reusing existing Langfuse prompts (signature match)");
    return {
      plannerPromptName: plannerName,
      extractorPromptName: extractorName,
      goalSignature,
      createdNewVersion: false,
    };
  }

  console.log("🔄 Generating new Langfuse prompt templates with OpenAI...");

  // Allowed variables for Langfuse mustache templates
  const plannerVars = ["goalTitle", "goalDescription", "notes"];
  const extractorVars = [
    "goalTitle",
    "goalDescription",
    "goalType",
    "paperTitle",
    "paperAuthors",
    "paperYear",
    "paperVenue",
    "paperDoi",
    "paperUrl",
    "paperAbstract",
  ];

  let pack: PromptPack | null = null;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`  Attempt ${attempt}/3...`);

      const { object: candidate } = await generateObject({
        model: deepseek("deepseek-chat"),
        temperature: 1.0,
        schema: PromptPackSchema,
        prompt: `
You are generating Langfuse Prompt Management TEXT templates for a therapeutic/psychological research system.
These prompts will be used to find and extract relevant psychological research papers for a given therapy goal.

Context:
Goal Title: ${goalTitle}
Goal Description: ${goalDescription}
Notes:
- ${notes.join("\n- ")}

TASK
Generate two Langfuse TEXT prompt templates (strings) that use ONLY {{variables}} for interpolation.

TEMPLATE A: plannerPrompt
- Input variables allowed: ${plannerVars.map((v) => `{{${v}}}`).join(", ")}
- Output: JSON for a multi-source research query plan.
- The plan should identify the therapeutic goal type, relevant psychological keywords,
  and diverse search queries for Semantic Scholar, Crossref, and PubMed.
- Queries should target evidence-based psychological interventions, therapeutic techniques,
  and clinical research related to the goal.
- Include fail-closed rule: if abstract is fewer than 200 characters or missing, reject the paper.
- Must produce MULTIPLE smaller queries (query pack) rather than one long query for better recall.

TEMPLATE B: extractorPrompt
- Input variables allowed: ${extractorVars.map((v) => `{{${v}}}`).join(", ")}
- Output: STRICT JSON extraction of therapeutic research relevance from a paper.
- REQUIRED JSON FIELDS:
  * domain: enum ["cbt", "act", "dbt", "behavioral", "psychodynamic", "somatic", "humanistic", "other"]
  * paperMeta: {title, authors[], year, venue, doi, url}
  * studyType: enum ["meta-analysis", "RCT", "field study", "lab study", "quasi-experimental", "review", "other"]
  * populationContext: string or null
  * interventionOrSkill: string or null (the specific therapy technique or intervention studied)
  * keyFindings: array of strings (3-5 findings directly from the abstract)
  * evidenceSnippets: array of {findingIndex: number, snippet: string}
  * practicalTakeaways: array of strings (2-4 actionable insights for therapists/clients)
  * relevanceScore: number 0-1 (how relevant to the therapeutic goal)
  * confidence: number 0-1 (confidence in the extraction quality)
  * rejectReason: string or null
- MUST include fail-closed rule: "If abstract is missing or has fewer than 200 characters, return empty extraction with relevanceScore=0 and confidence=0 and rejectReason='insufficient_abstract'"
- Score 0.1 or lower if paper is NOT about psychological/therapeutic research.

CRITICAL REQUIREMENTS FOR BOTH TEMPLATES:
1. Use ONLY the allowed {{variables}} listed above - no others.
2. Include the literal string "${metaLine}" in BOTH templates.
3. Be specific and instructive - these prompts will guide AI to find relevant therapy research.

Return JSON with keys: plannerPrompt, extractorPrompt.
        `.trim(),
      });

      // Normalize + force signature line
      candidate.plannerPrompt = ensureMetaLine(
        candidate.plannerPrompt,
        metaLine,
      );
      candidate.extractorPrompt = ensureMetaLine(
        candidate.extractorPrompt,
        metaLine,
      );

      // Validate templates
      assertOnlyAllowedVars(
        candidate.plannerPrompt,
        plannerVars,
        "plannerPrompt",
      );
      assertOnlyAllowedVars(
        candidate.extractorPrompt,
        extractorVars,
        "extractorPrompt",
      );

      pack = candidate;
      console.log(`  ✅ Valid prompts generated on attempt ${attempt}`);
      break;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.log(`  ⚠️  Attempt ${attempt} failed: ${lastError.message}`);

      if (attempt === 3) {
        console.error(
          `  ❌ All 3 attempts failed. Last error: ${lastError.message}`,
        );
        throw lastError;
      }

      await new Promise((resolve) => setTimeout(resolve, 700));
    }
  }

  if (!pack) {
    throw new Error("Failed to generate valid prompts after 3 attempts");
  }

  console.log("✅ Templates validated, saving to Langfuse...");

  await upsertLangfuseTextPrompt({
    name: plannerName,
    prompt: pack.plannerPrompt,
    label,
  });

  await upsertLangfuseTextPrompt({
    name: extractorName,
    prompt: pack.extractorPrompt,
    label,
  });

  await langfuse.flushAsync();

  console.log(`✅ Saved ${plannerName} and ${extractorName} to Langfuse`);

  return {
    plannerPromptName: plannerName,
    extractorPromptName: extractorName,
    goalSignature,
    createdNewVersion: true,
  };
}

export const langfusePromptPackTools = {
  ensure: ensureLangfusePromptPackForGoal,
};
