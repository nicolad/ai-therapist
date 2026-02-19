import type { MutationResolvers } from "./../../types.generated";
import OpenAI from "openai";
import { uploadToR2, generateAudioKey } from "@/lib/r2-uploader";
import { MDocument } from "@mastra/rag";
import { d1 } from "@/src/db/d1";
import { parseBuffer } from "music-metadata";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_CHARS = 4000; // OpenAI limit is 4096, use 4000 to be safe

async function chunkTextForSpeech(text: string): Promise<string[]> {
  // Create MDocument from text
  const doc = MDocument.fromText(text);

  // Use recursive strategy for smart content structure splitting
  const chunks = await doc.chunk({
    strategy: "recursive",
    maxSize: MAX_CHARS,
    overlap: 50,
    separators: ["\n\n", "\n", ". ", "! ", "? "],
  });

  // Extract text from chunks
  return chunks.map((chunk) => chunk.text);
}

async function saveAudioToStory(
  storyId: number,
  audioKey: string,
  audioUrl: string | null,
  userEmail: string,
): Promise<void> {
  const now = new Date().toISOString();
  await d1.execute({
    sql: `UPDATE stories 
          SET audio_key = ?, audio_url = ?, audio_generated_at = ?, updated_at = ?
          WHERE id = ? AND user_id = ?`,
    args: [audioKey, audioUrl || "", now, now, storyId, userEmail],
  });
}

export const generateOpenAIAudio: NonNullable<MutationResolvers['generateOpenAIAudio']> = async (_parent, args, ctx) => {
  const userEmail = ctx.userEmail;
  if (!userEmail) {
    throw new Error("Authentication required");
  }

  try {
    const {
      text,
      storyId,
      voice,
      model,
      speed,
      responseFormat,
      uploadToCloud,
      instructions,
    } = args.input;

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

    // Check if text needs to be chunked
    if (text.length > MAX_CHARS) {
      const chunks = await chunkTextForSpeech(text);

      // Process chunks and combine audio (ALWAYS merge at the end for story)
      const audioChunks: Buffer[] = [];

      for (const chunk of chunks) {
        const response = await openai.audio.speech.create({
          model: openAIModel,
          voice: openAIVoice as any,
          input: chunk,
          response_format: format as any,
          speed: speed || 0.9,
          ...(instructions && { instructions }),
        });

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        audioChunks.push(buffer);
      }

      // CRITICAL: Combine all chunks into a single audio file for the story
      const combined = Buffer.concat(audioChunks);
      console.log(
        `Merged ${chunks.length} audio chunks into single file (${combined.length} bytes)`,
      );

      // Calculate audio duration
      let audioDuration: number | null = null;
      try {
        const metadata = await parseBuffer(combined, {
          mimeType: `audio/${format}`,
        });
        audioDuration = metadata.format.duration || null;
        console.log(`Audio duration: ${audioDuration?.toFixed(2)}s`);
      } catch (error) {
        console.warn("Failed to parse audio duration:", error);
      }

      // Upload to Cloudflare R2 if requested
      if (uploadToCloud) {
        const key = generateAudioKey("graphql-tts");
        const result = await uploadToR2({
          key,
          body: combined,
          contentType: `audio/${format}`,
          metadata: {
            voice: openAIVoice,
            model: openAIModel,
            textLength: text.length.toString(),
            chunks: chunks.length.toString(),
            generatedBy: userEmail,
            ...(instructions && { instructions }),
          },
        });

        // Save audio to story if storyId is provided
        if (storyId) {
          await saveAudioToStory(
            storyId,
            result.key,
            result.publicUrl,
            userEmail,
          );
        }

        // Return both URL and buffer for fallback support
        const base64Audio = combined.toString("base64");

        return {
          success: true,
          message: `Audio generated from ${chunks.length} chunks and uploaded to R2`,
          audioBuffer: base64Audio, // Include base64 for fallback
          audioUrl: result.publicUrl,
          key: result.key,
          sizeBytes: result.sizeBytes,
          duration: audioDuration,
        };
      }

      // Convert to base64 for GraphQL response
      const base64Audio = combined.toString("base64");

      return {
        success: true,
        message: `Audio generated successfully from ${chunks.length} chunks`,
        audioBuffer: base64Audio,
        audioUrl: null,
        key: null,
        sizeBytes: combined.length,
        duration: audioDuration,
      };
    }

    // For short text, generate directly
    const response = await openai.audio.speech.create({
      model: openAIModel,
      voice: openAIVoice as any,
      input: text,
      response_format: format as any,
      speed: speed || 0.9,
      ...(instructions && { instructions }),
    });

    // Convert response to buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Calculate audio duration
    let audioDuration: number | null = null;
    try {
      const metadata = await parseBuffer(buffer, {
        mimeType: `audio/${format}`,
      });
      audioDuration = metadata.format.duration || null;
      console.log(`Audio duration: ${audioDuration?.toFixed(2)}s`);
    } catch (error) {
      console.warn("Failed to parse audio duration:", error);
    }

    // Upload to Cloudflare R2 if requested
    if (uploadToCloud) {
      const key = generateAudioKey("graphql-tts");
      const result = await uploadToR2({
        key,
        body: buffer,
        contentType: `audio/${format}`,
        metadata: {
          voice: openAIVoice,
          model: openAIModel,
          textLength: text.length.toString(),
          generatedBy: userEmail,
          ...(instructions && { instructions }),
        },
      });

      // Save audio to story if storyId is provided
      if (storyId) {
        await saveAudioToStory(
          storyId,
          result.key,
          result.publicUrl,
          userEmail,
        );
      }

      // Return both URL and buffer for fallback support
      const base64Audio = buffer.toString("base64");

      return {
        success: true,
        message: "Audio generated and uploaded to R2",
        audioBuffer: base64Audio, // Include base64 for fallback
        audioUrl: result.publicUrl,
        key: result.key,
        sizeBytes: result.sizeBytes,
        duration: audioDuration,
      };
    }

    // Convert to base64 for GraphQL response
    const base64Audio = buffer.toString("base64");

    return {
      success: true,
      message: "Audio generated successfully",
      audioBuffer: base64Audio,
      audioUrl: null,
      key: null,
      sizeBytes: buffer.length,
      duration: audioDuration,
    };
  } catch (error) {
    console.error("OpenAI TTS Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to generate audio",
      audioBuffer: null,
      audioUrl: null,
      key: null,
      sizeBytes: null,
      duration: null,
    };
  }
};
