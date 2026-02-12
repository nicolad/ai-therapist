"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Card,
  Badge,
  Spinner,
  Link,
  Separator,
  TextArea,
} from "@radix-ui/themes";
import { GlassButton } from "@/app/components/GlassButton";
import {
  ArrowLeftIcon,
  Pencil1Icon,
  TrashIcon,
  SpeakerLoudIcon,
  StopIcon,
} from "@radix-ui/react-icons";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  useGetStoryQuery,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
  useGenerateOpenAiAudioMutation,
  OpenAittsVoice,
  OpenAittsModel,
  OpenAiAudioFormat,
} from "@/app/__generated__/hooks";
import { authClient } from "@/src/auth/client";

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function StoryPageContent() {
  const router = useRouter();
  const params = useParams();
  const storyId = parseInt(params.id as string);
  const { data: session } = authClient.useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [forceRegenerate, setForceRegenerate] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  );

  const { data, loading, error, refetch } = useGetStoryQuery({
    variables: { id: storyId },
    skip: !storyId,
  });

  const [updateStory, { loading: updating }] = useUpdateStoryMutation({
    onCompleted: () => {
      setIsEditing(false);
      refetch();
    },
  });

  const [deleteStory, { loading: deleting }] = useDeleteStoryMutation({
    onCompleted: (data) => {
      if (data.deleteStory.success) {
        const goalId = story?.goal?.id;
        if (goalId) {
          router.push(`/goals/${goalId}`);
        } else {
          router.push("/goals");
        }
      }
    },
  });

  const [generateAudio, { loading: generatingAudio }] =
    useGenerateOpenAiAudioMutation();

  const story = data?.story;

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
        <Spinner size="3" />
      </Flex>
    );
  }

  if (error || !story) {
    return (
      <Card>
        <Text color="red">
          {error ? `Error: ${error.message}` : "Story not found"}
        </Text>
      </Card>
    );
  }

  const handleEdit = () => {
    setEditContent(story.content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editContent.trim()) return;
    await updateStory({
      variables: {
        id: storyId,
        input: { content: editContent },
      },
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this story?")) {
      await deleteStory({
        variables: { id: storyId },
      });
    }
  };

  const handleRegenerateAudio = () => {
    setForceRegenerate(true);
    handleTextToSpeech();
  };

  const handleTextToSpeech = async () => {
    if (isPlayingAudio && audioElement) {
      // Stop playback
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlayingAudio(false);
      setAudioElement(null);
      return;
    }

    try {
      setIsPlayingAudio(true);

      // Check if story already has audio and not forcing regeneration
      if (story.audioUrl && !forceRegenerate) {
        console.log("Playing existing audio from R2:", story.audioUrl);

        const audio = new Audio();
        audio.crossOrigin = "anonymous";

        audio.onloadstart = () => {
          console.log("Audio loading started");
        };

        audio.onloadedmetadata = () => {
          console.log("Audio metadata loaded, duration:", audio.duration);
          if (audio.duration && !isNaN(audio.duration)) {
            setAudioDuration(audio.duration);
          }
        };

        audio.oncanplay = () => {
          console.log("Audio can play");
        };

        audio.onended = () => {
          console.log("Audio playback ended");
          setIsPlayingAudio(false);
          setAudioElement(null);
        };

        audio.onerror = (e) => {
          console.error("Audio playback error:", e);
          setIsPlayingAudio(false);
          setAudioElement(null);
        };

        setAudioElement(audio);
        audio.src = story.audioUrl;

        try {
          await audio.play();
          console.log("Audio playback started successfully");
        } catch (playError) {
          console.error("Play error:", playError);
          setIsPlayingAudio(false);
          setAudioElement(null);
        }
        return;
      }

      // Generate new audio using GraphQL mutation
      const result = await generateAudio({
        variables: {
          input: {
            text: story.content,
            storyId: story.id,
            voice: OpenAittsVoice.Alloy,
            model: OpenAittsModel.Gpt_4OMiniTts,
            speed: 0.9,
            responseFormat: OpenAiAudioFormat.Mp3,
            uploadToCloud: true, // Upload to Cloudflare R2
          },
        },
      });

      if (!result.data?.generateOpenAIAudio.success) {
        throw new Error(
          result.data?.generateOpenAIAudio.message ||
            "Failed to generate audio",
        );
      }

      // Refetch story to get updated audio fields
      await refetch();

      // Capture audio duration from mutation result
      const duration = result.data.generateOpenAIAudio.duration;
      if (duration) {
        setAudioDuration(duration);
        console.log(`Audio duration captured: ${duration.toFixed(2)}s`);
      }

      // Reset force regenerate flag
      setForceRegenerate(false);

      // Check if we got a cloud URL
      const audioUrl = result.data.generateOpenAIAudio.audioUrl;
      const audioBuffer = result.data.generateOpenAIAudio.audioBuffer;

      if (audioUrl) {
        console.log("Playing audio from R2:", audioUrl);

        // Use cloud URL directly
        const audio = new Audio();

        // Add CORS mode for R2
        audio.crossOrigin = "anonymous";

        audio.onloadstart = () => {
          console.log("Audio loading started");
        };

        audio.onloadedmetadata = () => {
          console.log("Audio metadata loaded, duration:", audio.duration);
          if (audio.duration && !isNaN(audio.duration)) {
            setAudioDuration(audio.duration);
          }
        };

        audio.oncanplay = () => {
          console.log("Audio can play");
        };

        audio.onended = () => {
          console.log("Audio playback ended");
          setIsPlayingAudio(false);
          setAudioElement(null);
        };

        audio.onerror = (e) => {
          console.error("R2 audio playback error, trying base64 fallback:", e);

          // If R2 fails and we have audioBuffer, try base64 fallback
          if (audioBuffer) {
            console.log("Switching to base64 audio fallback");
            playBase64Audio(audioBuffer);
          } else {
            setIsPlayingAudio(false);
            setAudioElement(null);
          }
        };

        setAudioElement(audio);
        audio.src = audioUrl;

        try {
          await audio.play();
          console.log("Audio playback started successfully");
        } catch (playError) {
          console.error("Play error, trying base64 fallback:", playError);
          if (audioBuffer) {
            playBase64Audio(audioBuffer);
          } else {
            setIsPlayingAudio(false);
            setAudioElement(null);
          }
        }
        return;
      }

      // Fallback to base64 audio buffer (like CRM implementation)
      if (audioBuffer) {
        playBase64Audio(audioBuffer);
        return;
      }

      throw new Error("No audio data received");
    } catch (error) {
      console.error("TTS Error:", error);
      setIsPlayingAudio(false);
      setAudioElement(null);
    }
  };

  const playBase64Audio = async (audioBuffer: string) => {
    try {
      console.log("Playing audio from base64 buffer");

      // Convert base64 to blob (like CRM implementation)
      const binaryString = atob(audioBuffer);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "audio/mpeg" });

      // Create audio element
      const blobUrl = URL.createObjectURL(blob);
      const audio = new Audio(blobUrl);

      audio.onended = () => {
        setIsPlayingAudio(false);
        setAudioElement(null);
        URL.revokeObjectURL(blobUrl);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        setAudioElement(null);
        URL.revokeObjectURL(blobUrl);
      };

      setAudioElement(audio);
      await audio.play();
    } catch (error) {
      console.error("TTS Error:", error);
      setIsPlayingAudio(false);
      setAudioElement(null);
    }
  };

  const canEdit = session?.user?.email === story.createdBy;

  return (
    <Flex direction="column" gap="4">
      {/* Story Card */}
      <Card>
        <Flex direction="column" gap="4" p="4">
          <Flex justify="between" align="start" gap="3">
            <Flex direction="column" gap="2" style={{ flex: 1 }}>
              <Flex align="center" gap="2">
                <Text size="1" color="gray" weight="medium">
                  Created by {story.createdBy}
                </Text>
              </Flex>
              <Flex gap="4" wrap="wrap">
                <Flex direction="column" gap="1">
                  <Text size="1" color="gray" weight="medium">
                    Created
                  </Text>
                  <Text size="2">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </Text>
                </Flex>
                {story.updatedAt !== story.createdAt && (
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray" weight="medium">
                      Last Updated
                    </Text>
                    <Text size="2">
                      {new Date(story.updatedAt).toLocaleDateString()}
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Flex>
            {canEdit && (
              <Flex gap="2">
                {!isEditing && (
                  <>
                    <GlassButton
                      variant="secondary"
                      size="medium"
                      onClick={handleEdit}
                      disabled={deleting}
                    >
                      <Pencil1Icon />
                      Edit
                    </GlassButton>
                    <GlassButton
                      variant="destructive"
                      size="medium"
                      onClick={handleDelete}
                      disabled={deleting}
                      loading={deleting}
                    >
                      <TrashIcon />
                      Delete
                    </GlassButton>
                  </>
                )}
              </Flex>
            )}
          </Flex>

          {isEditing ? (
            <Flex direction="column" gap="3">
              <TextArea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Write your story here..."
                size="3"
                style={{ minHeight: "300px" }}
              />
              <Flex gap="2" justify="end">
                <GlassButton
                  variant="secondary"
                  size="medium"
                  onClick={() => setIsEditing(false)}
                  disabled={updating}
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  variant="primary"
                  size="medium"
                  onClick={handleSave}
                  disabled={updating || !editContent.trim()}
                  loading={updating}
                >
                  Save
                </GlassButton>
              </Flex>
            </Flex>
          ) : (
            <Flex direction="column" gap="3">
              {/* Audio Section */}
              {story.audioUrl && (
                <Card
                  style={{
                    background: "var(--indigo-2)",
                    borderColor: "var(--indigo-6)",
                  }}
                >
                  <Flex direction="column" gap="2" p="3">
                    <Flex align="center" gap="2">
                      <SpeakerLoudIcon color="indigo" />
                      <Text size="2" weight="medium" color="indigo">
                        Audio Available
                      </Text>
                      {story.audioGeneratedAt && (
                        <Badge color="indigo" variant="soft" size="1">
                          Generated{" "}
                          {new Date(
                            story.audioGeneratedAt,
                          ).toLocaleDateString()}
                        </Badge>
                      )}
                      {audioDuration && (
                        <Badge color="indigo" variant="soft" size="1">
                          {formatDuration(audioDuration)}
                        </Badge>
                      )}
                    </Flex>
                    <Flex gap="2">
                      <GlassButton
                        variant="primary"
                        size="medium"
                        onClick={handleTextToSpeech}
                        disabled={generatingAudio}
                        loading={generatingAudio}
                      >
                        {isPlayingAudio ? (
                          <>
                            <StopIcon />
                            Stop Playback
                          </>
                        ) : (
                          <>
                            <SpeakerLoudIcon />
                            Play Audio
                          </>
                        )}
                      </GlassButton>
                      {!isPlayingAudio && (
                        <GlassButton
                          variant="secondary"
                          size="medium"
                          onClick={handleRegenerateAudio}
                          disabled={generatingAudio}
                        >
                          Regenerate
                        </GlassButton>
                      )}
                    </Flex>
                  </Flex>
                </Card>
              )}

              {/* Generate Audio Button */}
              {!story.audioUrl && (
                <Flex justify="start">
                  <GlassButton
                    variant="primary"
                    size="large"
                    onClick={handleTextToSpeech}
                    disabled={!story.content || generatingAudio}
                    loading={generatingAudio}
                  >
                    <SpeakerLoudIcon />
                    Generate Audio
                  </GlassButton>
                </Flex>
              )}

              <Text size="3" style={{ whiteSpace: "pre-wrap" }}>
                {story.content}
              </Text>
            </Flex>
          )}
        </Flex>
      </Card>

      {/* Related Goal */}
      {story.goal && (
        <Card>
          <Flex direction="column" gap="3" p="4">
            <Heading size="4">Related Goal</Heading>
            <Card
              style={{ cursor: "pointer", backgroundColor: "var(--gray-2)" }}
              onClick={() => {
                if (story.goal?.slug) {
                  router.push(`/goals/${story.goal.slug}`);
                } else if (story.goal?.id) {
                  router.push(`/goals/${story.goal.id}`);
                }
              }}
            >
              <Flex direction="column" gap="2" p="3">
                <Heading size="3">{story.goal.title}</Heading>
              </Flex>
            </Card>
          </Flex>
        </Card>
      )}
    </Flex>
  );
}

const DynamicStoryPageContent = dynamic(
  () => Promise.resolve(StoryPageContent),
  { ssr: false },
);

export default function StoryPage() {
  const router = useRouter();
  const params = useParams();
  const storyId = parseInt(params.id as string);
  const { data: session } = authClient.useSession();

  const { data } = useGetStoryQuery({
    variables: { id: storyId },
    skip: !storyId,
  });

  const story = data?.story;

  return (
    <Flex direction="column" gap="5">
      {/* Sticky Header */}
      <Box
        position="sticky"
        top="0"
        style={{
          zIndex: 20,
          background: "var(--color-panel)",
          borderBottom: "1px solid var(--gray-a6)",
          backdropFilter: "blur(10px)",
          marginLeft: "calc(-1 * var(--space-5))",
          marginRight: "calc(-1 * var(--space-5))",
          paddingLeft: "var(--space-5)",
          paddingRight: "var(--space-5)",
        }}
      >
        <Flex
          py="4"
          align="center"
          gap="4"
          style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}
        >
          <GlassButton
            variant="secondary"
            size="medium"
            onClick={() => {
              if (story?.goal?.slug) {
                router.push(`/goals/${story.goal.slug}`);
              } else if (story?.goalId) {
                router.push(`/goals/${story.goalId}`);
              } else {
                router.push("/goals");
              }
            }}
          >
            <ArrowLeftIcon />
            Back to Goal
          </GlassButton>

          <Separator orientation="vertical" />

          <Box minWidth="0" style={{ flex: 1 }}>
            <Heading size="8" weight="bold">
              Story
            </Heading>
          </Box>
        </Flex>
      </Box>

      <Box style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <DynamicStoryPageContent />
      </Box>
    </Flex>
  );
}
