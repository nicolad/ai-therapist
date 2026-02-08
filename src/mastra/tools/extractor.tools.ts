import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateObject } from "ai";
import { z } from "zod";
import type { PaperDetails } from "./sources.tools";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

/**
 * Research Extraction Tools
 * Structured extraction of therapeutic research using AI SDK
 */

const TherapyResearchSchema = z.object({
  therapeuticGoalType: z
    .string()
    .describe(
      "Type of therapeutic goal (e.g., 'anxiety reduction', 'depression management')",
    ),
  title: z.string().describe("Paper title"),
  authors: z.array(z.string()).describe("Author names"),
  year: z.number().int().nullable().describe("Publication year"),
  journal: z.string().nullable().describe("Journal name"),
  doi: z.string().nullable().describe("DOI"),
  url: z.string().nullable().describe("URL"),
  abstract: z.string().nullable().describe("Abstract text"),
  keyFindings: z
    .array(z.string())
    .describe("Key findings relevant to the therapeutic goal (3-5 findings)"),
  therapeuticTechniques: z
    .array(z.string())
    .describe(
      "Specific therapeutic techniques mentioned (e.g., 'CBT', 'exposure therapy')",
    ),
  evidenceLevel: z
    .string()
    .nullable()
    .describe(
      "Evidence level: 'meta-analysis', 'RCT', 'cohort', 'case-study', or 'review'",
    ),
  relevanceScore: z.number().min(0).max(1).describe("Relevance to goal (0-1)"),
  extractedBy: z.string().describe("Extraction source identifier"),
  extractionConfidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence in extraction (0-1)"),
});

export type ExtractedResearch = z.infer<typeof TherapyResearchSchema>;

/**
 * Extract structured research from paper
 */
export async function extractResearch(params: {
  therapeuticGoalType: string;
  goalTitle: string;
  goalDescription: string;
  paper: PaperDetails;
}): Promise<ExtractedResearch> {
  const { therapeuticGoalType, goalTitle, goalDescription, paper } = params;

  const { object } = await generateObject({
    model: deepseek("deepseek-chat"),
    schema: TherapyResearchSchema,
    prompt: `Extract therapeutic research information from this paper.

Therapeutic Goal: ${goalTitle}
Goal Description: ${goalDescription}
Goal Type: ${therapeuticGoalType}

Paper:
Title: ${paper.title}
Authors: ${paper.authors?.join(", ") || "Unknown"}
Year: ${paper.year || "Unknown"}
Journal: ${paper.journal || "Unknown"}
DOI: ${paper.doi || "None"}
Abstract: ${paper.abstract}

CRITICAL: This should be THERAPEUTIC/PSYCHOLOGICAL research for clinical/counseling applications.

Extract:
1. Key findings (3-5) that are DIRECTLY relevant to the therapeutic goal
2. Specific therapeutic techniques mentioned (e.g., CBT, exposure therapy, mindfulness)
3. Evidence level (meta-analysis > RCT > cohort > case-study > review)
4. Relevance score (0-1) based on how well it addresses the THERAPEUTIC goal

STRICT FILTERING:
- Score 0.1 or lower if paper is about: forensic interviews, legal proceedings, police work, medical diagnostics
- Score 0.1 or lower if NOT about psychological therapy or counseling
- Score 0.8+ only if directly about therapeutic interventions for the goal type
- Only extract findings EXPLICITLY stated in the abstract
- Do not infer or extrapolate beyond what is written
- Rate your extraction confidence honestly`,
  });

  return {
    ...object,
    extractedBy: "mastra:deepseek-chat:v1",
  };
}

/**
 * Repair extracted research based on feedback
 */
export async function repairResearch(params: {
  extracted: ExtractedResearch;
  abstract: string;
  feedback: string;
}): Promise<ExtractedResearch> {
  const { extracted, abstract, feedback } = params;

  const { object } = await generateObject({
    model: deepseek("deepseek-chat"),
    schema: TherapyResearchSchema,
    prompt: `Repair this research extraction based on feedback.

Original Extraction:
${JSON.stringify(extracted, null, 2)}

Abstract:
${abstract}

Feedback:
${feedback}

Instructions:
- Remove or rewrite any unsupported claims
- Ensure every finding is directly supported by the abstract
- Be more conservative in claims
- Lower confidence if uncertain
- Keep only well-supported findings`,
  });

  return {
    ...object,
    extractedBy: "mastra:deepseek-chat:v1-repaired",
  };
}

/**
 * Plan research query
 */
export async function planResearchQuery(params: {
  title: string;
  description: string;
  notes: string[];
}) {
  const { title, description, notes } = params;

  const { object } = await generateObject({
    model: deepseek("deepseek-chat"),
    schema: z.object({
      therapeuticGoalType: z.string().describe("Type of therapeutic goal"),
      keywords: z.array(z.string()).describe("Search keywords (5-8 terms)"),
      inclusion: z.array(z.string()).describe("Inclusion criteria"),
      exclusion: z.array(z.string()).describe("Exclusion criteria"),
    }),
    prompt: `Plan a research query for this THERAPEUTIC/PSYCHOLOGICAL goal.

Goal: ${title}
Description: ${description}
Notes: ${notes.join("\n- ")}

Generate search keywords and criteria for finding CLINICAL/THERAPEUTIC research papers.

CRITICAL CONTEXT GUIDELINES:
- This is about MENTAL HEALTH, THERAPY, or PERSONAL DEVELOPMENT
- Focus on psychological, counseling, or behavioral research
- Add context words like: therapy, psychological, mental health, counseling, behavioral, clinical
- For workplace/career topics: add "workplace psychology", "occupational therapy", "career counseling"
- For social topics: add "social anxiety", "interpersonal therapy", "communication skills therapy"

EXCLUSION EXAMPLES:
- If goal mentions "interviews": EXCLUDE forensic, legal, police, child, medical interviews
- If goal mentions "relationships": EXCLUDE studies on animals, non-human subjects
- If goal mentions technical topics: focus on the PSYCHOLOGICAL aspects only

1. Therapeutic goal type: Classify as specific therapy type (e.g., "social anxiety therapy", "workplace confidence counseling")
2. Search keywords: Include therapeutic context + specific topic (e.g., "job interview anxiety CBT", "workplace assertiveness therapy")
3. Inclusion criteria: Must be about therapeutic/psychological interventions for humans
4. Exclusion criteria: Filter out forensic, legal, medical, non-therapeutic contexts

Be specific and ALWAYS include therapeutic/psychological context in keywords.`,
  });

  return object;
}

export const extractorTools = {
  extract: extractResearch,
  repair: repairResearch,
  plan: planResearchQuery,
};
