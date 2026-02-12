import type { QueryResolvers } from "./../../types.generated";
import { VOICE_IDS } from "@/src/elevenlabs";

export const availableVoices: NonNullable<
  QueryResolvers["availableVoices"]
> = async (_parent, _args, _ctx) => {
  // Convert VOICE_IDS constant to GraphQL format
  return Object.entries(VOICE_IDS).map(([key, id]) => {
    const descriptions: Record<string, string> = {
      george: "Professional, calm, reassuring male voice",
      rachel: "Warm, clear, empathetic female voice",
      bella: "Soft, soothing, gentle female voice",
      adam: "Deep, calming, authoritative male voice",
      antoni: "Well-rounded, versatile male voice",
      josh: "Deep, professional male voice",
      arnold: "Crisp, authoritative male voice",
      sam: "Young, dynamic voice",
    };

    return {
      id,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      description: descriptions[key] || "ElevenLabs voice",
    };
  });
};
