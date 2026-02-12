import type { MutationResolvers } from "./../../types.generated";
import { createAudioStreamFromText, uploadAndGetUrl } from "@/src/elevenlabs";

export const uploadAudioToR2: NonNullable<
  MutationResolvers["uploadAudioToR2"]
> = async (_parent, args, _ctx) => {
  try {
    // Generate audio from text
    const audioBuffer = await createAudioStreamFromText(args.input.text, {
      voiceId: args.input.voiceId || undefined,
      modelId: args.input.modelId || undefined,
      speed: args.input.speed ?? undefined,
      stability: args.input.stability ?? undefined,
    });

    // Build metadata from input
    const metadata: Record<string, string> = {};
    if (args.input.metadata?.goalId) {
      metadata.goalId = args.input.metadata.goalId.toString();
    }
    if (args.input.metadata?.noteId) {
      metadata.noteId = args.input.metadata.noteId.toString();
    }
    if (args.input.metadata?.voice) {
      metadata.voice = args.input.metadata.voice;
    }
    if (args.input.metadata?.model) {
      metadata.model = args.input.metadata.model;
    }
    if (args.input.metadata?.generatedAt) {
      metadata.generatedAt = args.input.metadata.generatedAt;
    } else {
      metadata.generatedAt = new Date().toISOString();
    }

    // Upload to R2
    const { objectKey, url, isPublic } = await uploadAndGetUrl(audioBuffer, {
      contextPrefix: args.input.contextPrefix || undefined,
      filename: args.input.filename || undefined,
      contentType: "audio/mpeg",
      metadata,
      urlExpiresIn: 604800, // 7 days (R2 max)
    });

    return {
      success: true,
      message: isPublic
        ? "Audio uploaded successfully with public URL"
        : "Audio uploaded successfully with presigned URL (7 days)",
      objectKey,
      url,
      isPublic,
    };
  } catch (error) {
    console.error("Error uploading audio to R2:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      objectKey: "",
      url: "",
      isPublic: false,
    };
  }
};
