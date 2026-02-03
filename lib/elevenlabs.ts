import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream } from "fs";
import { v4 as uuid } from "uuid";

/**
 * ElevenLabs utility for direct API usage (alternative to Mastra voice)
 * Use this when you need more granular control over ElevenLabs features
 * Based on official ElevenLabs documentation
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.warn("ELEVENLABS_API_KEY not found in environment variables");
}

export const elevenlabs = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

/**
 * Convert text to speech and save as a file
 * @param text - Text to convert to speech
 * @param voiceId - ElevenLabs voice ID (default: George)
 * @param options - Voice settings and model options
 * @returns Promise<string> - The filename of the saved audio file
 */
export const createAudioFileFromText = async (
  text: string,
  voiceId: string = "JBFqnCBsd6RMkjVDRZzb", // George - professional voice
  options?: {
    modelId?: string;
    outputFormat?: string;
    stability?: number;
    similarityBoost?: number;
    useSpeakerBoost?: boolean;
    speed?: number;
  },
): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const audio = await elevenlabs.textToSpeech.convert(voiceId, {
        modelId: options?.modelId || "eleven_multilingual_v2",
        text,
        outputFormat: (options?.outputFormat as any) || "mp3_44100_128",
        voiceSettings: {
          stability: options?.stability ?? 0.5,
          similarityBoost: options?.similarityBoost ?? 0.75,
          useSpeakerBoost: options?.useSpeakerBoost ?? true,
          speed: options?.speed ?? 0.9, // Slightly slower for therapeutic content
        },
      });

      const fileName = `${uuid()}.mp3`;
      const fileStream = createWriteStream(fileName);

      // Convert ReadableStream to Node.js stream
      const reader = audio.getReader();

      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              fileStream.end();
              break;
            }
            fileStream.write(Buffer.from(value));
          }
        } catch (err) {
          fileStream.destroy(err as Error);
        }
      };

      pump();

      fileStream.on("finish", () => resolve(fileName));
      fileStream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Convert text to speech and return audio stream as Buffer
 * @param text - Text to convert to speech
 * @param voiceId - ElevenLabs voice ID (default: George)
 * @param options - Voice settings and model options
 * @returns Promise<Buffer> - Audio data as Buffer
 */
export const createAudioStreamFromText = async (
  text: string,
  voiceId: string = "JBFqnCBsd6RMkjVDRZzb", // George - professional voice
  options?: {
    modelId?: string;
    outputFormat?: string;
    stability?: number;
    similarityBoost?: number;
    useSpeakerBoost?: boolean;
    speed?: number;
  },
): Promise<Buffer> => {
  const audioStream = await elevenlabs.textToSpeech.stream(voiceId, {
    modelId: options?.modelId || "eleven_multilingual_v2",
    text,
    outputFormat: (options?.outputFormat as any) || "mp3_44100_128",
    voiceSettings: {
      stability: options?.stability ?? 0.5,
      similarityBoost: options?.similarityBoost ?? 0.75,
      useSpeakerBoost: options?.useSpeakerBoost ?? true,
      speed: options?.speed ?? 0.9, // Slightly slower for therapeutic content
    },
  });

  // Convert ReadableStream to Buffer for Node.js
  const chunks: Uint8Array[] = [];
  const reader = audioStream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return Buffer.concat(chunks);
};

/**
 * Available ElevenLabs voices for therapeutic content
 */
export const THERAPEUTIC_VOICES = {
  george: {
    id: "JBFqnCBsd6RMkjVDRZzb",
    name: "George",
    description: "Professional, calm, reassuring",
  },
  rachel: {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    description: "Warm, clear, empathetic",
  },
  bella: {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    description: "Soft, soothing, gentle",
  },
  adam: {
    id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam",
    description: "Deep, calming, authoritative",
  },
} as const;

/**
 * Get voice ID by name
 */
export const getVoiceId = (
  voiceName: keyof typeof THERAPEUTIC_VOICES,
): string => {
  return THERAPEUTIC_VOICES[voiceName].id;
};
