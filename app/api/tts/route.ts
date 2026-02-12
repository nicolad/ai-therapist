import { NextRequest, NextResponse } from "next/server";
import { elevenlabs, THERAPEUTIC_VOICES } from "@/lib/elevenlabs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Use George voice by default (professional, calm, reassuring)
    const selectedVoiceId =
      voiceId || THERAPEUTIC_VOICES.george.id;

    // Stream audio from ElevenLabs
    const audioStream = await elevenlabs.textToSpeech.stream(selectedVoiceId, {
      modelId: "eleven_multilingual_v2",
      text,
      outputFormat: "mp3_44100_128",
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.75,
        useSpeakerBoost: true,
        speed: 0.9, // Slightly slower for therapeutic content
      },
    });

    // Convert ReadableStream to a format Next.js can stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = audioStream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            controller.enqueue(value);
          }
        } catch (error) {
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate audio",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
