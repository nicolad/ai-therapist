# AI Therapist

A Next.js application providing AI-powered therapeutic audio content with voice capabilities using Mastra agents and AI SDK.

## Features

- 🧠 **Evidence-Based Therapy**: CBT, MBSR, ACT, and DBT-inspired content
- 🎙️ **Voice Capabilities**: Multiple voice providers (OpenAI, ElevenLabs)
- 📊 **GraphQL API**: Goals and therapeutic research management
- 💾 **Conversation History**: libSQL storage for agent memory
- 🎨 **Modern UI**: Radix UI with responsive design
- 🔧 **AI SDK Integration**: Advanced voice and language model support

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- API Keys:
  - OpenAI API key
  - ElevenLabs API key (optional, for premium voices)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp example.env .env.local

# Add your API keys to .env.local
# OPENAI_API_KEY=sk-proj-xxx
# ELEVENLABS_API_KEY=sk_xxx
```

### Development

```bash
# Run Next.js dev server
pnpm dev

# Run Mastra dev server (for agents)
pnpm mastra:dev

# Build for production
pnpm build
pnpm start
```

Visit [http://localhost:3000](http://localhost:3000)

## Available Agents

### 1. Story Teller Agent

Interactive storytelling with branching narratives and OpenAI voice.

```typescript
import { storyTellerAgent } from "@/src/mastra/agents";

const response = await storyTellerAgent.generate(
  "Create a science fiction story about a barista in Seattle"
);
```

### 2. Therapeutic Agent (OpenAI)

Evidence-based therapeutic content with OpenAI TTS (tts-1-hd, nova voice).

```typescript
import { therapeuticAgent } from "@/src/mastra/agents";

const audio = await therapeuticAgent.voice.speak(
  "Welcome to your mindfulness practice..."
);
```

### 3. Therapeutic Agent (ElevenLabs)

Premium quality therapeutic audio using ElevenLabs (George voice).

```typescript
import { therapeuticAgentElevenLabs } from "@/src/mastra/agents";

const audio = await therapeuticAgentElevenLabs.voice.speak(
  "Take a deep breath in... and slowly exhale..."
);
```

## AI SDK Integration

This project uses AI SDK for language models and advanced voice capabilities:

### Language Models

All agents use AI SDK's OpenAI provider:

```typescript
import { openai } from "@ai-sdk/openai";

const agent = new Agent({
  model: openai("gpt-4o"), // AI SDK model
  // ...
});
```

### Direct Speech Generation

Use AI SDK directly for advanced speech features:

```typescript
import { elevenlabs } from "@ai-sdk/elevenlabs";
import { generateSpeech } from "ai";

const { audio } = await generateSpeech({
  model: elevenlabs.speech("eleven_turbo_v2"),
  voice: "JBFqnCBsd6RMkjVDRZzb",
  text: "Hello from AI SDK!",
});
```

### ElevenLabs Direct SDK

For full control over ElevenLabs features:

```typescript
import { createAudioFileFromText } from "@/lib/elevenlabs";

// Generates MP3 file with therapeutic voice settings
const filename = await createAudioFileFromText(
  "Your therapeutic content here",
  "JBFqnCBsd6RMkjVDRZzb" // George voice
);
```

## GraphQL API

The application includes a complete GraphQL schema for managing therapeutic goals:

```graphql
mutation CreateGoal {
  createGoal(input: {
    title: "Reduce anxiety in social situations"
    description: "Practice CBT techniques before social events"
    therapeuticApproach: CBT
  }) {
    id
    title
    createdAt
  }
}

mutation GenerateAudio {
  generateAudio(goalId: "goal-123") {
    audioUrl
    duration
  }
}
```

See [schema/README.md](./schema/README.md) for full API documentation.

## Project Structure

```
ai-therapist/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Radix UI
│   └── page.tsx           # Homepage
├── src/mastra/            # Mastra configuration
│   ├── index.ts           # Mastra instance with libSQL
│   └── agents/            # Agent definitions
│       └── index.ts       # Story teller & therapeutic agents
├── lib/                   # Utilities
│   ├── elevenlabs.ts     # ElevenLabs SDK integration
│   └── mastra-client.ts  # Mastra client constants
├── graphql-schema/        # GraphQL schema & resolvers
│   ├── schema.graphql    # Type definitions
│   └── resolvers/        # Query/mutation resolvers
└── example.env           # Environment variables template
```

## Environment Variables

```env
# Required
OPENAI_API_KEY=sk-proj-xxx

# Optional (for premium voices)
ELEVENLABS_API_KEY=sk_xxx

# Optional (cost-effective LLM alternative)
DEEPSEEK_API_KEY=sk-xxx

# Database (default: local SQLite)
DATABASE_URL=file:./therapeutic.db

# For production with Turso
# DATABASE_URL=libsql://your-db.turso.io
# TURSO_AUTH_TOKEN=your_token
```

## Voice Providers

| Provider | Package | Features | Use Case |
|----------|---------|----------|----------|
| OpenAI | `@mastra/voice-openai` | TTS, STT | Fast, cost-effective |
| ElevenLabs | `@mastra/voice-elevenlabs` | Premium TTS | Production audio |
| AI SDK | `@ai-sdk/elevenlabs` | Direct SDK access | Advanced features |

## Technologies

- **Framework**: Next.js 15.2.3 (App Router, React 19)
- **AI Agent Platform**: Mastra with Memory support
- **Language Models**: OpenAI GPT-4o (via AI SDK)
- **Voice**: OpenAI TTS, ElevenLabs (Mastra + AI SDK)
- **Database**: libSQL (SQLite-compatible, Turso support)
- **GraphQL**: Apollo Client
- **UI**: Radix UI Themes
- **TypeScript**: Strict mode enabled

## Documentation

- [GraphQL Schema Documentation](./schema/README.md) - API reference and examples
- [Mastra Agents Guide](./lib/mastra-agents.md) - Detailed agent configuration
- [Mastra Docs](https://mastra.ai/docs) - Official Mastra documentation
- [AI SDK Docs](https://sdk.vercel.ai/docs) - AI SDK reference

## Development Tips

### Working with Voice Streams

Save speech output to file:

```typescript
import { createWriteStream } from "fs";

const audio = await agent.voice.speak("Hello!");
const writer = createWriteStream("output.mp3");
audio.pipe(writer);

await new Promise((resolve, reject) => {
  writer.on("finish", resolve);
  writer.on("error", reject);
});
```

Transcribe audio file:

```typescript
import { createReadStream } from "fs";

const audioStream = createReadStream("recording.m4a");
const text = await agent.voice.listen(audioStream, {
  filetype: "m4a",
});
```

### Debugging Agents

Enable debug logging:

```env
LOG_LEVEL=debug
```

Check agent memory:

```typescript
const memory = await agent.memory?.retrieve({
  userId: "user-123",
});
console.log(memory);
```

## License

MIT

## Support

For issues and questions:

- Check [Mastra Documentation](https://mastra.ai/docs)
- Review [AI SDK Docs](https://sdk.vercel.ai/docs)
- Open an issue on GitHub
