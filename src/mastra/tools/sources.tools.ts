/**
 * Research Source Tools
 * Provides multi-source research paper retrieval
 *
 * Integrations:
 * - Crossref API (no auth required)
 * - PubMed API (E-utilities)
 * - Semantic Scholar API (no auth required)
 *
 * Usage Example:
 * ```typescript
 * // Search multiple sources in parallel
 * const [crossref, pubmed, semantic] = await Promise.all([
 *   searchCrossref("cognitive behavioral therapy anxiety", 10),
 *   searchPubMed("cognitive behavioral therapy anxiety", 10),
 *   searchSemanticScholar("cognitive behavioral therapy anxiety", 10),
 * ]);
 *
 * // Deduplicate results
 * const candidates = dedupeCandidates([...crossref, ...pubmed, ...semantic]);
 *
 * // Fetch full details for top candidate
 * if (candidates.length > 0) {
 *   const details = await fetchPaperDetails(candidates[0]);
 *   console.log(details.title, details.abstract);
 * }
 * ```
 */

export interface PaperCandidate {
  title: string;
  doi?: string;
  url?: string;
  year?: number;
  source: string;
  authors?: string[];
  abstract?: string;
  journal?: string;
}

export interface PaperDetails extends PaperCandidate {
  abstract: string;
  authors: string[];
}

/**
 * Search Crossref for papers
 */
export async function searchCrossref(
  query: string,
  limit: number = 10,
): Promise<PaperCandidate[]> {
  try {
    const url = new URL("https://api.crossref.org/works");
    url.searchParams.set("query", query);
    url.searchParams.set("rows", limit.toString());
    url.searchParams.set(
      "select",
      "DOI,title,author,published,container-title,abstract,URL",
    );

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "AI-Therapist/1.0 (mailto:research@example.com)",
      },
    });

    if (!response.ok) {
      console.error(`Crossref API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const items = data.message?.items || [];

    return items.map((item: any) => ({
      title: Array.isArray(item.title)
        ? item.title[0]
        : item.title || "Untitled",
      doi: item.DOI,
      url: item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : undefined),
      year: item.published?.["date-parts"]?.[0]?.[0],
      source: "crossref",
      authors: item.author
        ?.map((a: any) => `${a.given || ""} ${a.family || ""}`.trim())
        .filter(Boolean),
      abstract: item.abstract,
      journal: Array.isArray(item["container-title"])
        ? item["container-title"][0]
        : item["container-title"],
    }));
  } catch (error) {
    console.error("Error searching Crossref:", error);
    return [];
  }
}

/**
 * Search PubMed for papers
 */
export async function searchPubMed(
  query: string,
  limit: number = 10,
): Promise<PaperCandidate[]> {
  try {
    // Step 1: Search for PMIDs
    const searchUrl = new URL(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
    );
    searchUrl.searchParams.set("db", "pubmed");
    searchUrl.searchParams.set("term", query);
    searchUrl.searchParams.set("retmax", limit.toString());
    searchUrl.searchParams.set("retmode", "json");

    const searchResponse = await fetch(searchUrl.toString());
    if (!searchResponse.ok) {
      console.error(`PubMed search error: ${searchResponse.status}`);
      return [];
    }

    const searchData = await searchResponse.json();
    const idList = searchData.esearchresult?.idlist || [];

    if (idList.length === 0) {
      return [];
    }

    // Step 2: Fetch summaries for PMIDs
    const summaryUrl = new URL(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi",
    );
    summaryUrl.searchParams.set("db", "pubmed");
    summaryUrl.searchParams.set("id", idList.join(","));
    summaryUrl.searchParams.set("retmode", "json");

    const summaryResponse = await fetch(summaryUrl.toString());
    if (!summaryResponse.ok) {
      console.error(`PubMed summary error: ${summaryResponse.status}`);
      return [];
    }

    const summaryData = await summaryResponse.json();
    const results = summaryData.result;

    return idList
      .map((id: string) => {
        const paper = results[id];
        if (!paper) return null;

        return {
          title: paper.title || "Untitled",
          doi: paper.elocationid
            ?.split(" ")
            .find((id: string) => id.startsWith("doi:"))
            ?.replace("doi:", ""),
          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          year: parseInt(paper.pubdate?.split(" ")[0]),
          source: "pubmed",
          authors: paper.authors?.map((a: any) => a.name) || [],
          journal: paper.fulljournalname || paper.source,
        };
      })
      .filter(Boolean) as PaperCandidate[];
  } catch (error) {
    console.error("Error searching PubMed:", error);
    return [];
  }
}

/**
 * Search Semantic Scholar for papers
 */
export async function searchSemanticScholar(
  query: string,
  limit: number = 10,
): Promise<PaperCandidate[]> {
  try {
    const url = new URL(
      "https://api.semanticscholar.org/graph/v1/paper/search",
    );
    url.searchParams.set("query", query);
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set(
      "fields",
      "title,abstract,year,authors,externalIds,journal,url",
    );

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`Semantic Scholar API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const papers = data.data || [];

    return papers.map((paper: any) => ({
      title: paper.title || "Untitled",
      doi: paper.externalIds?.DOI,
      url:
        paper.url ||
        (paper.externalIds?.DOI
          ? `https://doi.org/${paper.externalIds.DOI}`
          : undefined),
      year: paper.year,
      source: "semantic_scholar",
      authors: paper.authors?.map((a: any) => a.name) || [],
      abstract: paper.abstract,
      journal: paper.journal?.name,
    }));
  } catch (error) {
    console.error("Error searching Semantic Scholar:", error);
    return [];
  }
}

/**
 * Fetch full paper details
 */
export async function fetchPaperDetails(
  candidate: PaperCandidate,
): Promise<PaperDetails> {
  try {
    // Try to enrich from Crossref if we have a DOI
    if (candidate.doi) {
      const url = `https://api.crossref.org/works/${encodeURIComponent(candidate.doi)}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "AI-Therapist/1.0 (mailto:research@example.com)",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const item = data.message;

        return {
          ...candidate,
          title:
            candidate.title ||
            (Array.isArray(item.title) ? item.title[0] : item.title),
          abstract:
            item.abstract || candidate.abstract || "Abstract not available",
          authors:
            candidate.authors ||
            item.author
              ?.map((a: any) => `${a.given || ""} ${a.family || ""}`.trim())
              .filter(Boolean) ||
            [],
          year: candidate.year || item.published?.["date-parts"]?.[0]?.[0],
          journal:
            candidate.journal ||
            (Array.isArray(item["container-title"])
              ? item["container-title"][0]
              : item["container-title"]),
        };
      }
    }

    // If from PubMed, try to get abstract
    if (candidate.source === "pubmed" && candidate.url) {
      const pmid = candidate.url.match(/\/(\d+)\//)?.[1];
      if (pmid) {
        const url = new URL(
          "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",
        );
        url.searchParams.set("db", "pubmed");
        url.searchParams.set("id", pmid);
        url.searchParams.set("retmode", "xml");

        const response = await fetch(url.toString());
        if (response.ok) {
          const xml = await response.text();
          // Basic XML parsing for abstract
          const abstractMatch = xml.match(
            /<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/,
          );
          if (abstractMatch) {
            const abstract = abstractMatch[1].replace(/<[^>]+>/g, "").trim();
            return {
              ...candidate,
              abstract: abstract || "Abstract not available",
              authors: candidate.authors || [],
            };
          }
        }
      }
    }

    // If from Semantic Scholar, try their API
    if (candidate.source === "semantic_scholar" && candidate.doi) {
      const url = new URL(
        `https://api.semanticscholar.org/graph/v1/paper/DOI:${candidate.doi}`,
      );
      url.searchParams.set("fields", "title,abstract,year,authors,journal");

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        return {
          ...candidate,
          abstract:
            data.abstract || candidate.abstract || "Abstract not available",
          authors:
            data.authors?.map((a: any) => a.name) || candidate.authors || [],
          year: data.year || candidate.year,
          journal: data.journal?.name || candidate.journal,
        };
      }
    }
  } catch (error) {
    console.error("Error fetching paper details:", error);
  }

  // Fallback to candidate data
  return {
    ...candidate,
    abstract: candidate.abstract || "Abstract not available",
    authors: candidate.authors || [],
  };
}

/**
 * Deduplicate candidates by DOI/title
 */
export function dedupeCandidates(
  candidates: PaperCandidate[],
): PaperCandidate[] {
  const seen = new Set<string>();
  const unique: PaperCandidate[] = [];

  for (const candidate of candidates) {
    // Prefer DOI for deduplication
    const key = candidate.doi || candidate.title.toLowerCase().trim();

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(candidate);
    }
  }

  return unique;
}

export const sourceTools = {
  searchCrossref,
  searchPubMed,
  searchSemanticScholar,
  fetchPaperDetails,
  dedupeCandidates,
};
