/**
 * ElevenLabs Text-to-Speech with Cloudflare R2 Integration
 *
 * This module provides utilities for:
 * - Converting text to speech using ElevenLabs API
 * - Saving audio files locally
 * - Streaming audio to memory
 * - Uploading audio to Cloudflare R2 or AWS S3
 * - Generating presigned URLs for secure access
 *
 * Based on official ElevenLabs examples, modernized for @elevenlabs/elevenlabs-js v2
 */

export {
  createAudioFileFromText,
  type TextToSpeechOptions,
} from "./text-to-speech-file";

export {
  createAudioStreamFromText,
  type TextToSpeechStreamOptions,
} from "./text-to-speech-stream";

export {
  uploadAudioToR2,
  uploadAudioToStorage, // Legacy alias
  generatePresignedUrl,
  getPublicUrl,
  uploadAndGetUrl,
  type UploadOptions,
} from "./r2-uploader";

// Re-export commonly used voice IDs
export const VOICE_IDS = {
  george: "JBFqnCBsd6RMkjVDRZzb", // Professional, calm
  rachel: "21m00Tcm4TlvDq8ikWAM", // Warm, clear
  bella: "EXAVITQu4vr4xnSDxMaL", // Soft, soothing
  adam: "pNInz6obpgDQGcFmaJgB", // Deep, calming
  antoni: "ErXwobaYiN019PkySvjV", // Well-rounded
  josh: "TxGEqnHWrfWFTfGW9XjX", // Deep, professional
  arnold: "VR6AewLTigWG4xSOukaG", // Crisp, authoritative
  sam: "yoZ06aMxZJJ28mfd3POQ", // Young, dynamic
} as const;

export const MODELS = {
  multilingual_v2: "eleven_multilingual_v2",
  turbo_v2_5: "eleven_turbo_v2_5",
  flash_v2_5: "eleven_flash_v2_5",
} as const;

export const OUTPUT_FORMATS = {
  mp3_44100_128: "mp3_44100_128",
  mp3_44100_192: "mp3_44100_192",
  pcm_16000: "pcm_16000",
  pcm_22050: "pcm_22050",
  pcm_24000: "pcm_24000",
  pcm_44100: "pcm_44100",
} as const;
