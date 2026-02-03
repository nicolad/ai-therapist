import type { SubscriptionResolvers } from "@/schema/types.generated";
import { db, researchJobs } from "@/lib/db";
import { eq } from "drizzle-orm";

/**
 * Subscription resolvers for research job updates
 *
 * Note: These use a polling-based approach compatible with HTTP multipart subscriptions
 * For production, consider using Redis pub/sub or Cloudflare Durable Objects
 */

const POLL_INTERVAL = 2000; // Poll every 2 seconds

export const Subscription: SubscriptionResolvers = {
  researchJobStatus: {
    subscribe: async function* (_parent, { threadId }, _ctx) {
      let lastStatus: string | null = null;
      let attempts = 0;
      const maxAttempts = 60; // 2 minutes max

      while (attempts < maxAttempts) {
        attempts++;

        try {
          const [job] = await db
            .select()
            .from(researchJobs)
            .where(eq(researchJobs.threadId, threadId))
            .limit(1);

          if (job && job.status !== lastStatus) {
            lastStatus = job.status;

            yield {
              researchJobStatus: {
                threadId: job.threadId,
                goalId: job.goalId,
                status: job.status.toUpperCase() as any,
                error: job.error,
                itemsGenerated: job.itemsGenerated || 0,
                progress: calculateProgress(job.status, job.itemsGenerated),
                message: getStatusMessage(job.status, job.itemsGenerated),
                completedAt: job.completedAt,
              },
            };

            // Stop if terminal state
            if (job.status === "completed" || job.status === "failed") {
              break;
            }
          }

          // Wait before next poll
          await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        } catch (error) {
          console.error("Subscription polling error:", error);
          yield {
            researchJobStatus: {
              threadId,
              goalId: 0,
              status: "FAILED" as any,
              error: error instanceof Error ? error.message : "Unknown error",
              itemsGenerated: 0,
              progress: 0,
              message: "Subscription error",
              completedAt: null,
            },
          };
          break;
        }
      }
    },
  },

  researchJobsForGoal: {
    subscribe: async function* (_parent, { goalId }, _ctx) {
      let lastUpdate: string | null = null;
      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        attempts++;

        try {
          const jobs = await db
            .select()
            .from(researchJobs)
            .where(eq(researchJobs.goalId, goalId))
            .orderBy(researchJobs.createdAt)
            .limit(10);

          const latestJob = jobs[0];
          const currentUpdate = latestJob?.updatedAt || null;

          if (latestJob && currentUpdate !== lastUpdate) {
            lastUpdate = currentUpdate;

            yield {
              researchJobsForGoal: {
                threadId: latestJob.threadId,
                goalId: latestJob.goalId,
                status: latestJob.status.toUpperCase() as any,
                error: latestJob.error,
                itemsGenerated: latestJob.itemsGenerated || 0,
                progress: calculateProgress(
                  latestJob.status,
                  latestJob.itemsGenerated,
                ),
                message: getStatusMessage(
                  latestJob.status,
                  latestJob.itemsGenerated,
                ),
                completedAt: latestJob.completedAt,
              },
            };

            if (
              latestJob.status === "completed" ||
              latestJob.status === "failed"
            ) {
              break;
            }
          }

          await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        } catch (error) {
          console.error("Subscription polling error:", error);
          break;
        }
      }
    },
  },
};

function calculateProgress(
  status: string,
  itemsGenerated: number | null,
): number {
  switch (status) {
    case "pending":
      return 0;
    case "processing":
      return itemsGenerated ? Math.min(itemsGenerated * 15, 90) : 10;
    case "completed":
      return 100;
    case "failed":
      return 0;
    default:
      return 0;
  }
}

function getStatusMessage(
  status: string,
  itemsGenerated: number | null,
): string {
  switch (status) {
    case "pending":
      return "Research job queued";
    case "processing":
      return itemsGenerated
        ? `Generated ${itemsGenerated} research items...`
        : "Generating research...";
    case "completed":
      return `Successfully generated ${itemsGenerated || 0} research items`;
    case "failed":
      return "Research generation failed";
    default:
      return "Unknown status";
  }
}
