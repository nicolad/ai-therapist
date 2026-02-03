import type { NoteResolvers } from "./../types.generated";
import { tursoTools } from "@/src/mastra/tools/turso.tools";

export const Note: NoteResolvers = {
  linkedResearch: async (parent, _args, _ctx) => {
    const research = await tursoTools.getResearchForNote(parent.id);
    return research;
  },
};