import type { MutationResolvers } from "../../types.generated";
import { claimCardsTools } from "../../../src/mastra/tools/claim-cards.tools";
import { sourceTools } from "../../../src/mastra/tools/sources.tools";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateObject } from "ai";
import { z } from "zod";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

/**
 * Build Claim Cards Resolver
 * 
 * Enhanced to ensure claims are grounded in actual research content:
 * 1. When text is provided, first searches for relevant research papers
 * 2. Extracts claims from the papers' abstracts (not just the input text)
 * 3. This ensures claims are evidence-based and verifiable against real research
 * 4. Falls back to text-only extraction if no papers are found
 */
export const buildClaimCards: NonNullable<MutationResolvers['buildClaimCards']> = async (_parent, { input }) => {
  const { text, claims, perSourceLimit, topK, useLlmJudge, sources } = input;

  // Map GraphQL enums to lowercase source names
  const sourcesLowercase = sources?.map((s) => s.toLowerCase()) as any[];
  const allowedSources = sourcesLowercase ?? ["semantic_scholar", "crossref", "pubmed"];

  let cards;
  
  if (text) {
    // Enhanced text processing: Search research first, then extract claims from actual papers
    const searchLimit = perSourceLimit ?? 15;
    
    // 1. Search for relevant papers across multiple sources
    const searchPromises: Promise<any[]>[] = [];
    
    if (allowedSources.includes("semantic_scholar")) {
      searchPromises.push(sourceTools.searchSemanticScholar(text, searchLimit).catch(() => []));
    }
    if (allowedSources.includes("crossref")) {
      searchPromises.push(sourceTools.searchCrossref(text, searchLimit).catch(() => []));
    }
    if (allowedSources.includes("pubmed")) {
      searchPromises.push(sourceTools.searchPubMed(text, searchLimit).catch(() => []));
    }
    if (allowedSources.includes("openalex")) {
      searchPromises.push(sourceTools.searchOpenAlex(text, searchLimit).catch(() => []));
    }
    
    const allResults = await Promise.all(searchPromises);
    const allPapers = allResults.flat();
    const deduped = sourceTools.dedupeCandidates(allPapers);
    
    // 2. Fetch full details for top papers
    const topPapers = deduped.slice(0, Math.min(20, searchLimit * 2));
    const papersWithDetails = await Promise.all(
      topPapers.map(async (p) => {
        try {
          return await sourceTools.fetchPaperDetails(p);
        } catch {
          return p;
        }
      })
    );
    
    // 3. Extract claims from the research papers' content (not just the user text)
    const papersContext = papersWithDetails
      .filter(p => p.abstract)
      .slice(0, 10) // Use top 10 papers with abstracts
      .map(p => `Title: ${p.title}\nAbstract: ${p.abstract}`)
      .join("\n\n---\n\n");
    
    if (papersContext) {
      // Extract research-grounded claims
      const claimsSchema = z.object({
        claims: z.array(z.string()).describe(
          "Atomic, testable claims extracted from the research papers. Each claim should be grounded in the actual research content."
        ),
      });
      
      const result = await generateObject({
        model: deepseek("deepseek-chat"),
        schema: claimsSchema,
        prompt: `You are extracting evidence-based claims from research papers.

User's topic/question: "${text}"

Research papers found:
${papersContext}

Task: Extract atomic, testable claims that:
1. Are directly supported by the research abstracts above
2. Are specific and measurable (include population, intervention, outcome when applicable)
3. Can be verified against the papers
4. Relate to the user's topic: "${text}"

Extract 5-12 high-quality claims that summarize the research findings.`,
      });
      
      const extractedClaims = result.object.claims;
      
      // Build claim cards from these research-grounded claims
      cards = await claimCardsTools.buildClaimCardsFromClaims(extractedClaims, {
        perSourceLimit: perSourceLimit ?? undefined,
        topK: topK ?? undefined,
        useLlmJudge: useLlmJudge ?? undefined,
        sources: sourcesLowercase,
      });
    } else {
      // Fallback to original method if no papers found
      cards = await claimCardsTools.buildClaimCardsFromText(text, {
        perSourceLimit: perSourceLimit ?? undefined,
        topK: topK ?? undefined,
        useLlmJudge: useLlmJudge ?? undefined,
        sources: sourcesLowercase,
      });
    }
  } else if (claims && claims.length > 0) {
    // For explicit claims, use the existing method
    cards = await claimCardsTools.buildClaimCardsFromClaims(claims, {
      perSourceLimit: perSourceLimit ?? undefined,
      topK: topK ?? undefined,
      useLlmJudge: useLlmJudge ?? undefined,
      sources: sourcesLowercase,
    });
  } else {
    throw new Error("Must provide either text or claims");
  }

  return { cards } as any;
};
