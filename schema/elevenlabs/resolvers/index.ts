/**
 * ElevenLabs GraphQL Resolvers
 *
 * Centralized exports for all ElevenLabs TTS resolvers.
 * Import these in your main resolver configuration.
 */

// Query resolvers
export { availableVoices } from "./availableVoices";

// Mutation resolvers
export { generateAudioFromText } from "./generateAudioFromText";
export { uploadAudioToR2 } from "./uploadAudioToR2";

// Type resolvers
export { GenerateAudioFromTextResult } from "./GenerateAudioFromTextResult";
export { UploadAudioToR2Result } from "./UploadAudioToR2Result";
export { ElevenLabsVoice } from "./ElevenLabsVoice";
