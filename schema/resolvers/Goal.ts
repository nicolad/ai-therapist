import type { GoalResolvers } from "./../types.generated";
import { tursoTools } from "@/src/db";

export const Goal: GoalResolvers = {
  research: async (parent, _args, _ctx) => {
    const research = await tursoTools.listTherapyResearch(parent.id);
    return research;
  },

  notes: async (parent, _args, _ctx) => {
    const notes = await tursoTools.listNotesForEntity(
      parent.id,
      "Goal",
      parent.createdBy,
    );
    return notes as any; // Field resolvers will populate viewerAccess
  },

  questions: async (parent, _args, _ctx) => {
    const questions = await tursoTools.listTherapeuticQuestions(parent.id);
    return questions;
  },

  stories: async (parent, _args, _ctx) => {
    const stories = await tursoTools.listGoalStories(parent.id);
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
    return tursoTools.listStories(parent.id, userEmail);
  },
};
