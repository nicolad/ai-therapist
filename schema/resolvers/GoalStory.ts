import type { GoalStoryResolvers } from "./../types.generated";
import { tursoTools } from "@/src/db";

export const GoalStory: GoalStoryResolvers = {
  segments: async (parent, _args, _ctx) => {
    const segments = await tursoTools.getTextSegmentsForStory(parent.id);
    return segments;
  },

  audioAssets: async (parent, _args, _ctx) => {
    const assets = await tursoTools.getAudioAssetsForStory(parent.id);
    return assets;
  },
};
