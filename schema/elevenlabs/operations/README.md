# ElevenLabs GraphQL Operations

All GraphQL operations (queries and mutations) for ElevenLabs TTS integration.

## Operations

### Queries

- **GetAvailableVoices.graphql** - Query all available ElevenLabs voices

### Mutations

- **GenerateAudioFromText.graphql** - Generate audio and return base64 buffer
- **UploadAudioToR2.graphql** - Generate audio and upload to Cloudflare R2

## Usage

Import these operations in your GraphQL client:

```typescript
import { GetAvailableVoicesDocument } from '@/app/__generated__';
import { UploadAudioToR2Document } from '@/app/__generated__';
```

After running `pnpm codegen`, TypeScript types will be generated automatically.

See [../README.md](../README.md) for detailed documentation and examples.
