/**
 * Turso Storage Adapter for Generic Claim Cards
 *
 * Implements StorageAdapter for persisting claim cards to Turso/SQLite.
 * Uses existing schema: claim_cards and notes_claims tables.
 */

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import path from "path";

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.DATABASE_URL ||
  `file:${path.join(process.cwd(), "therapeutic.db")}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url, authToken });
const db = drizzle(client);
import { claimCards, notesClaims } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import type {
  StorageAdapter,
  ClaimCard,
  EvidenceItem,
  ClaimScope,
} from "../tools/generic-claim-cards.tools";
import { toGqlClaimCards } from "@/schema/resolvers/utils/normalize-claim-card";

export function createTursoStorageAdapter(): StorageAdapter {
  return {
    name: "turso",

    async saveCard(card: ClaimCard, itemId?: string | number): Promise<void> {
      const noteId =
        typeof itemId === "number"
          ? itemId
          : itemId
            ? parseInt(itemId, 10)
            : null;

      // Convert confidence from 0-1 to 0-100 for storage
      const confidenceInt = Math.round(card.confidence * 100);

      // Serialize complex fields as JSON
      const scope = card.scope ? JSON.stringify(card.scope) : null;
      const evidence = JSON.stringify(card.evidence);
      const queries = JSON.stringify(card.queries);
      const provenance = JSON.stringify(card.provenance);

      // Upsert claim card
      await db
        .insert(claimCards)
        .values({
          id: card.id,
          noteId,
          claim: card.claim,
          scope,
          verdict: card.verdict,
          confidence: confidenceInt,
          evidence,
          queries,
          provenance,
          notes: card.notes ?? null,
          createdAt: card.createdAt,
          updatedAt: card.updatedAt,
        })
        .onConflictDoUpdate({
          target: claimCards.id,
          set: {
            claim: card.claim,
            scope,
            verdict: card.verdict,
            confidence: confidenceInt,
            evidence,
            queries,
            provenance,
            notes: card.notes ?? null,
            updatedAt: card.updatedAt,
          },
        });

      // Link to note if itemId provided
      if (noteId) {
        await db
          .insert(notesClaims)
          .values({
            noteId,
            claimId: card.id,
            createdAt: new Date().toISOString(),
          })
          .onConflictDoNothing();
      }
    },

    async saveCardsForItem(
      cards: ClaimCard[],
      itemId: string | number,
    ): Promise<void> {
      for (const card of cards) {
        await this.saveCard(card, itemId);
      }
    },

    async getCard(cardId: string): Promise<ClaimCard | null> {
      const rows = await db
        .select()
        .from(claimCards)
        .where(eq(claimCards.id, cardId))
        .limit(1);

      if (rows.length === 0) return null;

      const row = rows[0];
      return deserializeClaimCard(row);
    },

    async getCardsForItem(itemId: string | number): Promise<ClaimCard[]> {
      const noteId = typeof itemId === "number" ? itemId : parseInt(itemId, 10);

      const rows = await db
        .select({
          card: claimCards,
        })
        .from(notesClaims)
        .innerJoin(claimCards, eq(notesClaims.claimId, claimCards.id))
        .where(eq(notesClaims.noteId, noteId));

      const rawCards = rows.map((r: any) => deserializeClaimCard(r.card));
      
      // Normalize to ensure consistent GraphQL output
      return toGqlClaimCards(rawCards) as any;
    },

    async deleteCard(cardId: string): Promise<void> {
      // Delete links first
      await db.delete(notesClaims).where(eq(notesClaims.claimId, cardId));
      // Delete card
      await db.delete(claimCards).where(eq(claimCards.id, cardId));
    },
  };
}

function deserializeClaimCard(row: any): ClaimCard {
  return {
    id: row.id,
    claim: row.claim,
    scope: row.scope ? (JSON.parse(row.scope) as ClaimScope) : undefined,
    topic: undefined, // Not stored in current schema
    verdict: row.verdict,
    confidence: row.confidence / 100, // Convert back to 0-1
    evidence: JSON.parse(row.evidence) as EvidenceItem[],
    queries: JSON.parse(row.queries) as string[],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    provenance: JSON.parse(row.provenance),
    notes: row.notes ?? undefined,
  };
}
