import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream } from "fs";
import { v4 as uuid } from "uuid";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
}

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export interface TextToSpeechOptions {
  voiceId?: string;
  modelId?: string;
  outputFormat?: string;
  stability?: number;
  similarityBoost?: number;
  useSpeakerBoost?: boolean;
  speed?: number;
}

/**
 * Convert text to speech and save as an MP3 file
 * Uses the latest @elevenlabs/elevenlabs-js SDK
 *
 * @param text - Text to convert to speech
 * @param options - Voice settings and model options
 * @returns Promise<string> - The filename of the saved audio file
 */
export const createAudioFileFromText = async (
  text: string,
  options?: TextToSpeechOptions,
): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const voiceId = options?.voiceId || "JBFqnCBsd6RMkjVDRZzb"; // George

      const audio = await client.textToSpeech.convert(voiceId, {
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
