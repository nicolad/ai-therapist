# ElevenLabs GraphQL Schema

Organized GraphQL operations and resolvers for ElevenLabs text-to-speech integration.

## Structure

```
schema/elevenlabs/
├── operations/          # GraphQL query and mutation files
│   ├── GetAvailableVoices.graphql
│   ├── GenerateAudioFromText.graphql
│   └── UploadAudioToR2.graphql
├── resolvers/           # TypeScript resolver implementations
│   ├── availableVoices.ts
│   ├── generateAudioFromText.ts
│   ├── uploadAudioToR2.ts
│   ├── GenerateAudioFromTextResult.ts
│   ├── UploadAudioToR2Result.ts
│   └── ElevenLabsVoice.ts
└── README.md           # This file
```

## Queries

### `availableVoices`

Get list of available ElevenLabs voices for text-to-speech generation.

**Returns:** `[ElevenLabsVoice!]!`

**Example:**

```graphql
query GetAvailableVoices {
  availableVoices {
    id
    name
    description
  }
}
```

**Response:**

```json
{
  "data": {
    "availableVoices": [
      {
        "id": "JBFqnCBsd6RMkjVDRZzb",
        "name": "George",
        "description": "Professional, calm, reassuring male voice"
      },
      {
        "id": "21m00Tcm4TlvDq8ikWAM",
        "name": "Rachel",
        "description": "Warm, clear, empathetic female voice"
      }
      // ... more voices
    ]
  }
}
```

## Mutations

### `generateAudioFromText`

Generate audio from text using ElevenLabs TTS. Returns base64-encoded audio buffer.

**Input:** `GenerateAudioFromTextInput!`

- `text: String!` - Text to convert to speech
- `voiceId: String` - ElevenLabs voice ID (optional, defaults to George)
- `modelId: String` - Model to use (optional, defaults to eleven_multilingual_v2)
- `outputFormat: String` - Audio format (optional, defaults to mp3_44100_128)
- `stability: Float` - Voice stability 0-1 (optional, defaults to 0.5)
- `similarityBoost: Float` - Similarity boost 0-1 (optional, defaults to 0.75)
- `useSpeakerBoost: Boolean` - Enable speaker boost (optional, defaults to true)
- `speed: Float` - Speech speed 0.5-2.0 (optional, defaults to 1.0)

**Returns:** `GenerateAudioFromTextResult!`

**Example:**

```graphql
mutation GenerateAudioFromText(
  $text: String!
  $voiceId: String
  $speed: Float
) {
  generateAudioFromText(
    input: {
      text: $text
      voiceId: $voiceId
      speed: $speed
    }
  ) {
    success
    message
    audioBuffer  # base64-encoded MP3
    fileName
    sizeBytes
  }
}
```

**Variables:**

```json
{
  "text": "Hello, this is a test of the ElevenLabs text-to-speech system.",
  "voiceId": "JBFqnCBsd6RMkjVDRZzb",
  "speed": 1.0
}
```

### `uploadAudioToR2`

Generate audio from text and upload directly to Cloudflare R2 storage.

**Input:** `UploadAudioToR2Input!`

- `text: String!` - Text to convert to speech
- `voiceId: String` - ElevenLabs voice ID (optional)
- `modelId: String` - Model to use (optional)
- `contextPrefix: String` - R2 folder prefix (e.g., 'goal-123', 'note-456')
- `filename: String` - Custom filename (optional, defaults to UUID.mp3)
- `metadata: AudioMetadataInput` - Metadata to attach to R2 object
- `speed: Float` - Speech speed (optional)
- `stability: Float` - Voice stability (optional)

**Returns:** `UploadAudioToR2Result!`

**Example:**

```graphql
mutation UploadAudioToR2(
  $text: String!
  $contextPrefix: String
  $filename: String
  $metadata: AudioMetadataInput
) {
  uploadAudioToR2(
    input: {
      text: $text
      contextPrefix: $contextPrefix
      filename: $filename
      metadata: $metadata
    }
  ) {
    success
    message
    objectKey    # R2 object key (e.g., 'goal-123/meditation.mp3')
    url          # Public or presigned URL
    isPublic     # true if R2_PUBLIC_DOMAIN is configured
  }
}
```

**Variables:**

```json
{
  "text": "Welcome to your meditation session.",
  "contextPrefix": "goal-123",
  "filename": "meditation-intro.mp3",
  "metadata": {
    "goalId": 123,
    "voice": "George",
    "model": "eleven_multilingual_v2"
  }
}
```

**Response:**

```json
{
  "data": {
    "uploadAudioToR2": {
      "success": true,
      "message": "Audio uploaded successfully with public URL",
      "objectKey": "goal-123/meditation-intro.mp3",
      "url": "https://pub-longform-tts.r2.dev/goal-123/meditation-intro.mp3",
      "isPublic": true
    }
  }
}
```

## Types

### `ElevenLabsVoice`

```graphql
type ElevenLabsVoice {
  id: String!         # ElevenLabs voice ID
  name: String!       # Display name (e.g., "George", "Rachel")
  description: String! # Voice description
}
```

### `GenerateAudioFromTextResult`

```graphql
type GenerateAudioFromTextResult {
  success: Boolean!
  message: String
  audioBuffer: String  # base64-encoded audio data
  fileName: String
  sizeBytes: Int
}
```

### `UploadAudioToR2Result`

```graphql
type UploadAudioToR2Result {
  success: Boolean!
  message: String
  objectKey: String!  # R2 object path
  url: String!        # Access URL (public or presigned)
  isPublic: Boolean!  # Whether URL is permanent (public) or expires (presigned)
}
```

### `AudioMetadataInput`

```graphql
input AudioMetadataInput {
  goalId: Int
  noteId: Int
  voice: String
  model: String
  generatedAt: String
}
```

## Usage Examples

### Client-Side TypeScript (with Apollo Client)

```typescript
import { useQuery, useMutation } from '@apollo/client';
import { GetAvailableVoicesDocument, UploadAudioToR2Document } from '@/app/__generated__';

// Get available voices
const VoicePicker = () => {
  const { data, loading } = useQuery(GetAvailableVoicesDocument);

  if (loading) return <div>Loading voices...</div>;

  return (
    <select>
      {data?.availableVoices.map(voice => (
        <option key={voice.id} value={voice.id}>
          {voice.name} - {voice.description}
        </option>
      ))}
    </select>
  );
};

// Upload audio to R2
const AudioGenerator = () => {
  const [uploadAudio, { loading, data }] = useMutation(UploadAudioToR2Document);

  const handleGenerate = async (text: string) => {
    const result = await uploadAudio({
      variables: {
        text,
        contextPrefix: 'goal-123',
        filename: 'meditation.mp3',
        metadata: {
          goalId: 123,
          voice: 'George',
        },
      },
    });

    if (result.data?.uploadAudioToR2.success) {
      console.log('Audio URL:', result.data.uploadAudioToR2.url);
    }
  };

  return <button onClick={() => handleGenerate('Hello world')}>Generate</button>;
};
```

## Environment Variables

Required for resolvers to work:

```env
# ElevenLabs API
ELEVENLABS_API_KEY=sk_your_api_key

# Cloudflare R2 (for uploadAudioToR2)
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_ACCOUNT_ID=your_account_id
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_DOMAIN=https://pub-bucket.r2.dev  # Optional, for permanent URLs
```

## Integration

These resolvers integrate with the ElevenLabs SDK located at `/src/elevenlabs/`:

- `createAudioStreamFromText()` - Text-to-speech generation
- `uploadAndGetUrl()` - R2 upload with URL generation
- `VOICE_IDS` - Available voice constants

See [/src/elevenlabs/README.md](../../src/elevenlabs/README.md) for SDK documentation.

## Development

### Running Codegen

After modifying GraphQL schema or operations:

```bash
pnpm codegen
```

This will regenerate TypeScript types in `app/__generated__/`.

### Testing Resolvers

Use GraphQL playground or Apollo Studio:

```
http://localhost:3000/api/graphql
```

## Notes

- **R2 URLs**: Presigned URLs expire after 7 days (R2 maximum). Configure `R2_PUBLIC_DOMAIN` for permanent public URLs.
- **Audio Format**: Default output is MP3 44.1kHz 128kbps, suitable for most use cases.
- **File Organization**: Use `contextPrefix` to organize audio files by goal, note, or user (e.g., `goal-123/`, `note-456/`).
- **Metadata**: Attach custom metadata to R2 objects for easier tracking and management.
