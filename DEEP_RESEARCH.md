# Deep Research Integration - Mastra + Turso

## Overview

Integrated Mastra "deep research" pattern with eval-gated quality control for therapy research generation. All data stored in **Turso only** (no external storage).

## Architecture

### Single Database: Turso (libSQL)

Stores:
- **Business tables**: goals, therapy_research, therapeutic_questions, notes
- **Generation orchestration**: generation_jobs, workflow progress/events
- **RAG index**: embeddings + metadata (LibSQLVector)
- **Binary artifacts**: audio segments as BLOBs + manifests

### Eval-Gated Workflow

The `generateTherapyResearchWorkflow` implements:

1. **Multi-source retrieval** (Crossref, PubMed, Semantic Scholar)
2. **Structured extraction** with strict JSON schema
3. **Double-checking** with custom scorer (faithfulness gate)
4. **Repair loop** (one retry if score < 0.8)
5. **Top-K selection** (12 best papers)
6. **Turso persistence** + vector embedding

### Scorers

#### Built-in (Monitoring)
- `faithfulness`: Output reflects provided context
- `hallucination`: Detects unsupported/contradictory claims
- `completeness`: Required elements coverage
- `contextRelevance`: Retrieval quality

#### Custom (Gating)
- `research-grounding`: Validates keyFindings/techniques are supported by abstract
  - Score >= 0.8 required to pass
  - Failed extractions get one repair attempt

## File Structure

```
src/
  db/
    turso.ts                 # Database client + schema init
  mastra/
    index.ts                 # Mastra config (storage + vectors + workflows)
    scorers/
      researchGrounding.scorer.ts
      index.ts
    tools/
      turso.tools.ts         # DB operations
      rag.tools.ts           # Vector operations
      sources.tools.ts       # Multi-source paper search
      extractor.tools.ts     # AI-powered extraction
      index.ts
    workflows/
      generateTherapyResearch.workflow.ts
      index.ts
    agents/
      index.ts               # Existing agents
```

## Database Schema

See [src/db/turso.ts](src/db/turso.ts) for complete schema including:
- Core tables (goals, therapy_research, etc.)
- `generation_jobs` for async tracking
- `goal_stories` + `text_segments` for longform text
- `audio_assets` + `audio_segments` for BLOB storage

## Workflow Steps

### 1. Load Context
```typescript
{goalId, userId} → {goal, notes}
```

### 2. Plan Query
```typescript
{goal, notes} → {therapeuticGoalType, keywords, inclusion, exclusion}
```

### 3. Multi-Source Search
```typescript
{keywords} → {candidates[]}  // Crossref + PubMed + Semantic Scholar
```

### 4. Extract + Gate (per candidate)
```typescript
{candidate} → extract → grounding score >= 0.8? → repair if needed → {ok, research}
```

### 5. Persist Top Results
```typescript
{results[]} → top 12 → upsert DB + embed vectors → {count}
```

## Eval Gating

Each paper extraction:
1. **Extract** structured JSON (title, findings, techniques, etc.)
2. **Score** with `research-grounding` scorer
3. **Gate**: score >= 0.8?
   - ✅ Yes → accept
   - ❌ No → **repair** (rewrite unsupported claims) → re-score
   - ❌ Still no → **drop**

Result: Only high-confidence (>=0.8) extractions persist.

## RAG Integration

After persisting research:
- Chunks abstract into `goalContext` vector
- Chunks each keyFinding
- Chunks each therapeuticTechnique
- Metadata: `{goalId, entityType, entityId, source}`

Future workflows (questions, longform) retrieve from vectors filtered by `goalId`.

## Usage

### Run Workflow

```typescript
import { mastra } from "@/src/mastra";

const result = await mastra.workflows.generateTherapyResearchWorkflow.execute({
  userId: "user-123",
  goalId: 42,
});

console.log(result);
// { success: true, count: 8, message: "Generated 8 high-confidence research papers" }
```

### Query Jobs

```typescript
import { tursoTools } from "@/src/mastra/tools";

const job = await tursoTools.getGenerationJob("job-uuid");
console.log(job.status); // RUNNING | SUCCEEDED | FAILED
```

### RAG Retrieval

```typescript
import { ragTools } from "@/src/mastra/tools";

const context = await ragTools.retrieveGoalContext(
  goalId,
  "CBT techniques for anxiety",
  10
);
```

## Next Steps

### Immediate
1. ✅ Implement source APIs (Crossref, PubMed, Semantic Scholar)
2. Create `generateTherapeuticQuestions` workflow
3. Create `generateLongFormText` workflow
4. Create `generateAudio` workflow (TTS + BLOB storage)

### Advanced
- Cross-source corroboration (require 2+ papers per finding)
- Self-consistency selection (generate 2-3 candidates, pick best)
- Iterative loops with `.dountil()` (stop at N papers or max iterations)
- Guardrails (prompt injection, PII, moderation)

## Environment Variables

```env
# Required
TURSO_DATABASE_URL=file:./therapeutic.db  # or libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_token               # for remote Turso

# Optional (local file)
DATABASE_URL=file:./therapeutic.db
```

## Dependencies

Added packages:
- `@libsql/client` - Direct Turso client
- `@mastra/evals` - Built-in scorers
- `@mastra/libsql` - Storage + vectors

## References

- [Mastra Workflows](https://mastra.ai/docs/workflows/control-flow)
- [Mastra Evals](https://mastra.ai/docs/evals/overview)
- [LibSQL Vectors](https://mastra.ai/reference/vectors/libsql)
- [Custom Scorers](https://mastra.ai/docs/evals/custom-scorers)
