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

function StoryPageContent() {
  const router = useRouter();
  const params = useParams();
  const storyId = parseInt(params.id as string);
  const { data: session } = authClient.useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
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

      // Use GraphQL mutation for OpenAI TTS
      const result = await generateAudio({
        variables: {
          input: {
            text: story.content,
            voice: OpenAittsVoice.Alloy,
            model: OpenAittsModel.Gpt_4OMiniTts,
            speed: 0.9,
            responseFormat: OpenAiAudioFormat.Mp3,
          },
        },
      });

      if (!result.data?.generateOpenAIAudio.success) {
        throw new Error(
          result.data?.generateOpenAIAudio.message || "Failed to generate audio",
        );
      }

      const audioBuffer = result.data.generateOpenAIAudio.audioBuffer;
      if (!audioBuffer) {
        throw new Error("No audio data received");
      }

      // Convert base64 to blob
      const binaryString = atob(audioBuffer);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "audio/mpeg" });

      // Create audio element
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsPlayingAudio(false);
        setAudioElement(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        setAudioElement(null);
        URL.revokeObjectURL(audioUrl);
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
              <Flex justify="start">
                <GlassButton
                  variant="primary"
                  size="large"
                  onClick={handleTextToSpeech}
                  disabled={!story.content || generatingAudio}
                  loading={generatingAudio}
                >
                  {isPlayingAudio ? (
                    <>
                      <StopIcon />
                      Stop Audio
                    </>
                  ) : (
                    <>
                      <SpeakerLoudIcon />
                      Text to Speech
                    </>
                  )}
                </GlassButton>
              </Flex>
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
