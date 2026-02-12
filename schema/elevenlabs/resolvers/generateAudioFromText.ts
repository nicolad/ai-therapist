import type { MutationResolvers } from "./../../types.generated";
import { createAudioStreamFromText } from "@/src/elevenlabs";

export const generateAudioFromText: NonNullable<
  MutationResolvers["generateAudioFromText"]
> = async (_parent, args, _ctx) => {
  try {
    const audioBuffer = await createAudioStreamFromText(args.input.text, {
      voiceId: args.input.voiceId || undefined,
      modelId: args.input.modelId || undefined,
      outputFormat: args.input.outputFormat || undefined,
      stability: args.input.stability ?? undefined,
      similarityBoost: args.input.similarityBoost ?? undefined,
      useSpeakerBoost: args.input.useSpeakerBoost ?? undefined,
      speed: args.input.speed ?? undefined,
    });

    // Convert buffer to base64 for GraphQL response
    const audioBase64 = audioBuffer.toString("base64");

    return {
      success: true,
      message: "Audio generated successfully",
      audioBuffer: audioBase64,
      fileName: `audio-${Date.now()}.mp3`,
      sizeBytes: audioBuffer.length,
    };
  } catch (error) {
    console.error("Error generating audio:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      audioBuffer: null,
      fileName: null,
      sizeBytes: null,
    };
  }
};
