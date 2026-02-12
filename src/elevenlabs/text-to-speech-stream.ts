import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
}

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export interface TextToSpeechStreamOptions {
  voiceId?: string;
  modelId?: string;
  outputFormat?: string;
  stability?: number;
  similarityBoost?: number;
  useSpeakerBoost?: boolean;
  speed?: number;
}

/**
 * Convert text to speech and return audio as a Buffer (streaming)
 * Uses the latest @elevenlabs/elevenlabs-js SDK
 * Perfect for uploading to cloud storage or sending over network
 *
 * @param text - Text to convert to speech
 * @param options - Voice settings and model options
 * @returns Promise<Buffer> - Audio data as Buffer
 */
export const createAudioStreamFromText = async (
  text: string,
  options?: TextToSpeechStreamOptions,
): Promise<Buffer> => {
  const voiceId = options?.voiceId || "JBFqnCBsd6RMkjVDRZzb"; // George

  const audioStream = await client.textToSpeech.stream(voiceId, {
    text,
    modelId: options?.modelId || "eleven_multilingual_v2",
    outputFormat: (options?.outputFormat as any) || "mp3_44100_128",
    voiceSettings: {
      stability: options?.stability ?? 0.5,
      similarityBoost: options?.similarityBoost ?? 0.75,
      useSpeakerBoost: options?.useSpeakerBoost ?? true,
      speed: options?.speed ?? 1.0,
    },
  });

  // Convert ReadableStream to Buffer
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
