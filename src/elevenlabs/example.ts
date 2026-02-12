/**
 * ElevenLabs + Cloudflare R2 Example
 *
 * This example demonstrates:
 * 1. Converting text to speech and saving to local file
 * 2. Converting text to speech and streaming to memory
 * 3. Uploading audio to Cloudflare R2 (or AWS S3)
 * 4. Generating presigned URLs for secure access
 *
 * Setup:
 * 1. Create a .env file with:
 *    ELEVENLABS_API_KEY=your_elevenlabs_api_key
 *
 *    For Cloudflare R2:
 *    R2_ACCESS_KEY_ID=your_r2_access_key
 *    R2_SECRET_ACCESS_KEY=your_r2_secret_key
 *    R2_ACCOUNT_ID=your_cloudflare_account_id
 *    R2_BUCKET_NAME=your_r2_bucket_name
 *
 *    OR for AWS S3:
 *    AWS_ACCESS_KEY_ID=your_aws_access_key
 *    AWS_SECRET_ACCESS_KEY=your_aws_secret_key
 *    AWS_REGION_NAME=us-east-1
 *    AWS_S3_BUCKET_NAME=your_s3_bucket_name
 *
 * 2. Run: tsx src/elevenlabs/example.ts
 */

import "dotenv/config";
import {
  createAudioFileFromText,
  createAudioStreamFromText,
  uploadAndGetUrl,
  VOICE_IDS,
  MODELS,
} from "./index";

async function main() {
  const text =
    "Today, the sky is exceptionally clear, and the sun shines brightly. This is a test of the ElevenLabs text-to-speech integration with Cloudflare R2.";

  console.log("🎙️  ElevenLabs + Cloudflare R2 Example\n");

  // Example 1: Save audio to local file
  console.log("1️⃣  Creating local audio file...");
  try {
    const fileName = await createAudioFileFromText(text, {
      voiceId: VOICE_IDS.george,
      modelId: MODELS.multilingual_v2,
      speed: 1.0,
      stability: 0.5,
      similarityBoost: 0.75,
    });
    console.log(`   ✅ Saved to: ${fileName}\n`);
  } catch (error) {
    console.error("   ❌ Error:", error);
  }

  // Example 2: Stream audio to memory and upload to R2
  console.log("2️⃣  Streaming audio and uploading to cloud storage...");
  try {
    const audioBuffer = await createAudioStreamFromText(text, {
      voiceId: VOICE_IDS.rachel,
      modelId: MODELS.turbo_v2_5,
      speed: 0.95,
    });

    console.log(`   ✅ Generated ${audioBuffer.length} bytes of audio`);

    const { objectKey, url, isPublic } = await uploadAndGetUrl(audioBuffer, {
      contextPrefix: "goal-123", // Organize by goal/note ID
      filename: "meditation-intro.mp3",
      contentType: "audio/mpeg",
      metadata: {
        voice: "rachel",
        model: "turbo_v2_5",
        generatedAt: new Date().toISOString(),
      },
      urlExpiresIn: 604800, // 7 days (R2 maximum)
    });

    console.log(`   ✅ Uploaded to: ${objectKey}`);
    console.log(`   🔗 ${isPublic ? "Public" : "Presigned"} URL: ${url}\n`);
  } catch (error) {
    console.error("   ❌ Error:", error);
  }

  // Example 3: Using different voices
  console.log("3️⃣  Testing different voices...");
  const voices = [
    { name: "George (Professional)", id: VOICE_IDS.george },
    { name: "Bella (Soothing)", id: VOICE_IDS.bella },
    { name: "Adam (Deep)", id: VOICE_IDS.adam },
  ];

  for (const voice of voices) {
    try {
      const audioBuffer = await createAudioStreamFromText(
        "Hello, this is a voice sample.",
        {
          voiceId: voice.id,
          modelId: MODELS.flash_v2_5, // Faster model
        },
      );
      console.log(`   ✅ ${voice.name}: ${audioBuffer.length} bytes`);
    } catch (error) {
      console.error(`   ❌ ${voice.name} error:`, error);
    }
  }

  console.log("\n✨ Done!");
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { main };
