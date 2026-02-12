import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

/**
 * Cloudflare R2 Storage Uploader
 * Based on implementation from /Users/vadimnicolai/Public/crm/crm-next/tts/tts_helpers.py
 *
 * R2 is S3-compatible, so we use AWS SDK with R2-specific endpoint.
 * Files are organized by context (e.g., goal-{id}, note-{id}) for better organization.
 *
 * Required environment variables:
 * - R2_ACCESS_KEY_ID: Cloudflare R2 Access Key ID
 * - R2_SECRET_ACCESS_KEY: Cloudflare R2 Secret Access Key
 * - R2_ACCOUNT_ID: Your Cloudflare Account ID
 * - R2_BUCKET_NAME: R2 Bucket name
 * - R2_PUBLIC_DOMAIN: (Optional) Public domain for permanent URLs (e.g., https://pub-bucket.r2.dev)
 *
 * Note: R2 presigned URLs have a maximum expiration of 7 days.
 * For permanent URLs, configure R2_PUBLIC_DOMAIN with a public R2.dev or custom domain.
 */

const {
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_ACCOUNT_ID,
  R2_BUCKET_NAME,
  R2_PUBLIC_DOMAIN,
} = process.env;

// Validate required R2 credentials
if (
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_ACCOUNT_ID ||
  !R2_BUCKET_NAME
) {
  console.warn(
    "⚠️  Missing R2 credentials. Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID, R2_BUCKET_NAME",
  );
}

const BUCKET_NAME = R2_BUCKET_NAME!;

// Initialize R2 client with S3-compatible endpoint
// Endpoint format: https://{account_id}.r2.cloudflarestorage.com
const s3Client = new S3Client({
  region: "auto", // R2 uses 'auto' as region
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
});

export interface UploadOptions {
  /** MIME type (default: auto-detected from filename or 'audio/mpeg') */
  contentType?: string;
  /** Custom metadata key-value pairs */
  metadata?: Record<string, string>;
  /** Cache control header (default: public, max-age=31536000) */
  cacheControl?: string;
  /** Context prefix for organizing files (e.g., 'goal-123', 'note-456') */
  contextPrefix?: string;
  /** Custom filename (default: auto-generated UUID) */
  filename?: string;
}

/**
 * Detect content type from filename extension
 */
function getContentType(filename: string): string {
  if (filename.endsWith(".mp3")) return "audio/mpeg";
  if (filename.endsWith(".json")) return "application/json";
  if (filename.endsWith(".wav")) return "audio/wav";
  if (filename.endsWith(".ogg")) return "audio/ogg";
  if (filename.endsWith(".m4a")) return "audio/mp4";
  return "application/octet-stream";
}

/**
 * Upload audio buffer to Cloudflare R2
 * Organizes files by context (e.g., goal-{id}/filename.mp3) for better management
 *
 * @param audioBuffer - Audio data as Buffer
 * @param options - Upload options
 * @returns Promise<string> - The object key/path in the bucket
 *
 * @example
 * // Upload with goal context
 * const key = await uploadAudioToR2(buffer, {
 *   contextPrefix: 'goal-123',
 *   filename: 'intro.mp3'
 * });
 * // Result: 'goal-123/intro.mp3'
 */
export const uploadAudioToR2 = async (
  audioBuffer: Buffer,
  options?: UploadOptions,
): Promise<string> => {
  const filename = options?.filename || `${uuid()}.mp3`;
  const objectKey = options?.contextPrefix
    ? `${options.contextPrefix}/${filename}`
    : `audio/${filename}`;

  const contentType = options?.contentType || getContentType(filename);

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
        Body: audioBuffer,
        ContentType: contentType,
        Metadata: options?.metadata,
        CacheControl: options?.cacheControl || "public, max-age=31536000", // 1 year
      }),
    );

    console.log(`✅ Uploaded to R2: ${objectKey}`);
    return objectKey;
  } catch (error) {
    console.error(`❌ Failed to upload ${filename} to R2:`, error);
    throw error;
  }
};

/**
 * Generate a presigned URL for accessing an object
 * Note: R2 presigned URLs have a maximum expiration of 7 days (604800 seconds)
 *
 * @param objectKey - The object key/path in the bucket
 * @param expiresIn - URL expiration time in seconds (default: 1 hour, max: 7 days)
 * @returns Promise<string> - Presigned URL
 *
 * @example
 * const url = await generatePresignedUrl('goal-123/audio.mp3', 86400); // 1 day
 */
export const generatePresignedUrl = async (
  objectKey: string,
  expiresIn: number = 3600,
): Promise<string> => {
  // R2 maximum presigned URL expiration is 7 days (604800 seconds)
  const MAX_R2_EXPIRATION = 604800;
  const actualExpiration = Math.min(expiresIn, MAX_R2_EXPIRATION);

  if (expiresIn > MAX_R2_EXPIRATION) {
    console.warn(
      `⚠️  R2 presigned URLs max out at 7 days. Using ${MAX_R2_EXPIRATION}s instead of ${expiresIn}s`,
    );
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: actualExpiration,
  });

  return url;
};

/**
 * Get public URL for an object (requires R2_PUBLIC_DOMAIN to be configured)
 * Returns permanent public URL if R2_PUBLIC_DOMAIN is set, otherwise returns null
 *
 * To enable public access:
 * 1. Go to Cloudflare Dashboard → R2 → Your Bucket → Settings
 * 2. Enable "Public Access" or configure custom domain
 * 3. Set R2_PUBLIC_DOMAIN environment variable (e.g., https://pub-bucket.r2.dev)
 *
 * @param objectKey - The object key/path in the bucket
 * @returns string | null - Public URL or null if not configured
 *
 * @example
 * const publicUrl = getPublicUrl('goal-123/audio.mp3');
 * // Returns: 'https://pub-longform-tts.r2.dev/goal-123/audio.mp3'
 */
export const getPublicUrl = (objectKey: string): string | null => {
  if (!R2_PUBLIC_DOMAIN) {
    console.warn(
      "⚠️  R2_PUBLIC_DOMAIN not configured. Set it for permanent public URLs.",
    );
    return null;
  }

  // Remove trailing slash from domain if present
  const domain = R2_PUBLIC_DOMAIN.replace(/\/$/, "");
  return `${domain}/${objectKey}`;
};

/**
 * Upload audio to R2 and get URL (public if configured, otherwise presigned)
 * Prefers public URL for permanent access, falls back to presigned URL (7 days max)
 *
 * @param audioBuffer - Audio data as Buffer
 * @param options - Upload options
 * @returns Promise<{ objectKey: string; url: string; isPublic: boolean }> - Object key and access URL
 *
 * @example
 * const { objectKey, url, isPublic } = await uploadAndGetUrl(buffer, {
 *   contextPrefix: 'goal-123',
 *   filename: 'meditation.mp3',
 *   urlExpiresIn: 604800 // 7 days
 * });
 */
export const uploadAndGetUrl = async (
  audioBuffer: Buffer,
  options?: UploadOptions & { urlExpiresIn?: number },
): Promise<{ objectKey: string; url: string; isPublic: boolean }> => {
  const objectKey = await uploadAudioToR2(audioBuffer, options);

  // Prefer public URL if R2_PUBLIC_DOMAIN is configured
  const publicUrl = getPublicUrl(objectKey);
  if (publicUrl) {
    console.log(`🔗 Public URL (permanent): ${publicUrl}`);
    return { objectKey, url: publicUrl, isPublic: true };
  }

  // Fallback to presigned URL (max 7 days for R2)
  const presignedUrl = await generatePresignedUrl(
    objectKey,
    options?.urlExpiresIn || 604800, // Default to 7 days
  );

  console.log(
    `🔗 Presigned URL (valid 7 days): ${presignedUrl.substring(0, 80)}...`,
  );
  console.log(
    `⚠️  Note: R2 presigned URLs expire after 7 days. Set R2_PUBLIC_DOMAIN for permanent URLs.`,
  );

  return { objectKey, url: presignedUrl, isPublic: false };
};

// Legacy alias for backward compatibility
export const uploadAudioToStorage = uploadAudioToR2;
