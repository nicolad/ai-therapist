import type { GoalResolvers } from "./../types.generated";
import { d1Tools } from "@/src/db";

export const Goal: GoalResolvers = {
  research: async (parent, _args, _ctx) => {
    const research = await d1Tools.listTherapyResearch(parent.id);
    return research;
  },

  notes: async (parent, _args, _ctx) => {
    const notes = await d1Tools.listNotesForEntity(
      parent.id,
      "Goal",
      parent.createdBy,
    );
    return notes as any; // Field resolvers will populate viewerAccess
  },

  questions: async (parent, _args, _ctx) => {
    const questions = await d1Tools.listTherapeuticQuestions(parent.id);
    return questions;
  },

  stories: async (parent, _args, _ctx) => {
    const stories = await d1Tools.listGoalStories(parent.id);
    return stories.map((story) => ({
      ...story,
      segments: [],
      audioAssets: [],
    }));
  },

  userStories: async (parent, _args, ctx) => {
    const userEmail = ctx.userEmail;
    if (!userEmail) {
      return [];
    }
    return d1Tools.listStories(parent.id, userEmail);
  },

  subgoals: async (parent, _args, ctx) => {
    const userEmail = ctx.userEmail;
    if (!userEmail) {
      return [];
    }
    return d1Tools.listSubgoalsForGoal(parent.id, userEmail);
  },
};
