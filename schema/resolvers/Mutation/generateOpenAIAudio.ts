import type { MutationResolvers } from "./../../types.generated";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateOpenAIAudio: NonNullable<
  MutationResolvers["generateOpenAIAudio"]
> = async (_parent, args, ctx) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  try {
    const { text, voice, model, speed, responseFormat } = args.input;

    if (!text) {
      throw new Error("Text is required");
    }

    // Map GraphQL enums to OpenAI API values
    const openAIVoice = voice?.toLowerCase() || "alloy";
    const openAIModel = model
      ? model === "GPT_4O_MINI_TTS"
        ? "gpt-4o-mini-tts"
        : model === "TTS_1_HD"
          ? "tts-1-hd"
          : "tts-1"
      : "gpt-4o-mini-tts";
    const format = responseFormat?.toLowerCase() || "mp3";

    // Generate audio using OpenAI TTS
    const response = await openai.audio.speech.create({
      model: openAIModel,
      voice: openAIVoice as any,
      input: text,
      response_format: format as any,
      speed: speed || 0.9,
    });

    // Convert response to buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to base64 for GraphQL response
    const base64Audio = buffer.toString("base64");

    return {
      success: true,
      message: "Audio generated successfully",
      audioBuffer: base64Audio,
      audioUrl: null,
      sizeBytes: buffer.length,
      duration: null,
    };
  } catch (error) {
    console.error("OpenAI TTS Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to generate audio",
      audioBuffer: null,
      audioUrl: null,
      sizeBytes: null,
      duration: null,
    };
  }
};
