"use client";

import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { ChevronDownIcon } from "@radix-ui/react-icons";
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
  AlertDialog,
  Button,
} from "@radix-ui/themes";
import { GlassButton } from "@/app/components/GlassButton";
import { ArrowLeftIcon, TrashIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  useGetGoalQuery,
  useDeleteGoalMutation,
  useGenerateResearchMutation,
} from "@/app/__generated__/hooks";
import { useUser } from "@clerk/nextjs";
import AddSubGoalButton from "@/app/components/AddSubGoalButton";
import "./accordion.css";

function GoalPageContent() {
  const router = useRouter();
  const params = useParams();
  const paramValue = params.id as string;
  const { user } = useUser();

  // Determine if paramValue is a number (ID) or string (slug)
  const isNumericId = /^\d+$/.test(paramValue);
  const goalId = isNumericId ? parseInt(paramValue) : undefined;
  const goalSlug = !isNumericId ? paramValue : undefined;

  const { data, loading, error } = useGetGoalQuery({
    variables: {
      id: goalId,
      slug: goalSlug,
    },
    skip: !goalId && !goalSlug,
  });

  const goal = data?.goal;

  const [deleteGoal, { loading: deleting }] = useDeleteGoalMutation({
    onCompleted: () => {
      if (goal?.parentGoal) {
        router.push(
          goal.parentGoal.slug
            ? `/goals/${goal.parentGoal.slug}`
            : `/goals/${goal.parentGoal.id}`,
        );
      } else {
        router.push("/goals");
      }
    },
    refetchQueries: ["GetGoals", "GetGoal"],
  });

  const [researchMessage, setResearchMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [generateResearch, { loading: generatingResearch }] =
    useGenerateResearchMutation({
      onCompleted: (data) => {
        if (data.generateResearch.success) {
          setResearchMessage({
            text:
              data.generateResearch.message ||
              "Research generation started. This may take a few minutes.",
            type: "success",
          });
        } else {
          setResearchMessage({
            text: data.generateResearch.message || "Failed to generate research.",
            type: "error",
          });
        }
      },
      onError: (err) => {
        setResearchMessage({
          text: err.message || "An error occurred while generating research.",
          type: "error",
        });
      },
      refetchQueries: ["GetGoal"],
    });

  const handleGenerateResearch = async () => {
    if (!goal) return;
    setResearchMessage(null);
    await generateResearch({ variables: { goalId: goal.id } });
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
        <Spinner size="3" />
      </Flex>
    );
  }

  if (error || !goal) {
    return (
      <Card>
        <Text color="red">
          {error ? `Error: ${error.message}` : "Goal not found"}
        </Text>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "green";
      case "completed":
        return "blue";
      case "paused":
        return "orange";
      case "archived":
        return "gray";
      default:
        return "gray";
    }
  };

  const handleAddStory = () => {
    if (!goal) return;
    router.push(`/stories/new?goalId=${goal.id}`);
  };

  const handleDelete = async () => {
    await deleteGoal({ variables: { id: goal.id } });
  };

  return (
    <Flex direction="column" gap="4">
      {/* Parent Goal Link */}
      {goal.parentGoal && (
        <Card
          style={{
            backgroundColor: "var(--amber-3)",
            cursor: "pointer",
            border: "1px solid var(--amber-6)",
          }}
          onClick={() =>
            router.push(
              goal.parentGoal!.slug
                ? `/goals/${goal.parentGoal!.slug}`
                : `/goals/${goal.parentGoal!.id}`,
            )
          }
        >
          <Flex align="center" gap="3" p="1">
            <ArrowLeftIcon width="16" height="16" />
            <Flex direction="column" gap="0">
              <Text size="1" color="gray" weight="medium">
                Parent Goal
              </Text>
              <Flex align="center" gap="2">
                <Text size="3" weight="bold">
                  {goal.parentGoal.title}
                </Text>
                <Badge color={getStatusColor(goal.parentGoal.status)} size="1">
                  {goal.parentGoal.status}
                </Badge>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      )}

      {/* Main Goal Card */}
      <Card
        style={{
          backgroundColor: goal.parentGoalId
            ? "var(--violet-3)"
            : "var(--indigo-3)",
        }}
      >
        <Flex direction="column" gap="4" p="1">
          <Flex justify="between" align="start" gap="3">
            <Flex direction="column" gap="1">
              {goal.parentGoalId && (
                <Badge
                  color="violet"
                  variant="soft"
                  size="1"
                  style={{ width: "fit-content" }}
                >
                  Sub-Goal
                </Badge>
              )}
              <Heading size="7">{goal.title}</Heading>
            </Flex>
            <Flex align="center" gap="2">
              <Badge color={getStatusColor(goal.status)} size="2">
                {goal.status}
              </Badge>
              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Button
                    variant="ghost"
                    color="red"
                    size="2"
                    disabled={deleting}
                    style={{ cursor: "pointer" }}
                  >
                    <TrashIcon width="16" height="16" />
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content style={{ maxWidth: 450 }}>
                  <AlertDialog.Title>
                    Delete {goal.parentGoalId ? "Sub-Goal" : "Goal"}
                  </AlertDialog.Title>
                  <AlertDialog.Description size="2">
                    Are you sure you want to delete &ldquo;{goal.title}&rdquo;?
                    This will permanently remove the{" "}
                    {goal.parentGoalId ? "sub-goal" : "goal"} and all its
                    associated data (stories, research, notes, etc.).
                    {goal.subGoals && goal.subGoals.length > 0 && (
                      <Text as="p" size="2" color="red" weight="bold" mt="2">
                        Warning: This goal has {goal.subGoals.length} sub-goal
                        {goal.subGoals.length !== 1 ? "s" : ""} that will also
                        be orphaned.
                      </Text>
                    )}
                  </AlertDialog.Description>
                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button
                        variant="solid"
                        color="red"
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </Flex>
          </Flex>

          {goal.description && (
            <Text size="3" style={{ whiteSpace: "pre-wrap" }}>
              {goal.description}
            </Text>
          )}

          <Flex gap="4" wrap="wrap">
            <Flex direction="column" gap="1">
              <Text size="1" color="gray" weight="medium">
                Created
              </Text>
              <Text size="2">
                {new Date(goal.createdAt).toLocaleDateString()}
              </Text>
            </Flex>
            {goal.updatedAt !== goal.createdAt && (
              <Flex direction="column" gap="1">
                <Text size="1" color="gray" weight="medium">
                  Last Updated
                </Text>
                <Text size="2">
                  {new Date(goal.updatedAt).toLocaleDateString()}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Card>

      {/* Sub-Goals */}
      <Card>
        <Flex direction="column" gap="3" p="4">
          <Flex justify="between" align="center">
            <Heading size="4">
              Sub-Goals {goal.subGoals ? `(${goal.subGoals.length})` : ""}
            </Heading>
            <AddSubGoalButton goalId={goal.id} />
          </Flex>

          {goal.subGoals && goal.subGoals.length > 0 ? (
            <Flex direction="column" gap="2">
              {goal.subGoals.map((subGoal) => (
                <Card
                  key={subGoal.id}
                  style={{
                    backgroundColor: "var(--gray-2)",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    router.push(
                      subGoal.slug
                        ? `/goals/${subGoal.slug}`
                        : `/goals/${subGoal.id}`,
                    )
                  }
                >
                  <Flex direction="column" gap="2" p="3">
                    <Flex justify="between" align="center">
                      <Text size="3" weight="medium">
                        {subGoal.title}
                      </Text>
                      <Badge color={getStatusColor(subGoal.status)} size="1">
                        {subGoal.status}
                      </Badge>
                    </Flex>
                    {subGoal.description && (
                      <Text
                        size="2"
                        color="gray"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {subGoal.description}
                      </Text>
                    )}
                    <Text size="1" color="gray">
                      Created {new Date(subGoal.createdAt).toLocaleDateString()}
                    </Text>
                  </Flex>
                </Card>
              ))}
            </Flex>
          ) : (
            <Text size="2" color="gray">
              No sub-goals yet. Break this goal into smaller steps.
            </Text>
          )}
        </Flex>
      </Card>

      {/* Therapeutic Content */}
      {goal.therapeuticText && (
        <Card>
          <Flex direction="column" gap="3" p="4">
            <Flex align="center" gap="2">
              <Heading size="4">Therapeutic Guidance</Heading>
              {goal.therapeuticTextLanguage && (
                <Badge variant="soft" size="1">
                  {goal.therapeuticTextLanguage}
                </Badge>
              )}
            </Flex>
            <Text style={{ whiteSpace: "pre-wrap" }}>
              {goal.therapeuticText}
            </Text>
            {goal.therapeuticTextGeneratedAt && (
              <Text size="1" color="gray">
                Generated{" "}
                {new Date(goal.therapeuticTextGeneratedAt).toLocaleDateString()}
              </Text>
            )}
          </Flex>
        </Card>
      )}

      {/* Related Notes */}
      {goal.notes && goal.notes.length > 0 && (
        <Card>
          <Flex direction="column" gap="3" p="4">
            <Heading size="4">Related Notes ({goal.notes.length})</Heading>
            <Flex direction="column" gap="2">
              {goal.notes.map((note) => (
                <Card
                  key={note.id}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "var(--gray-2)",
                  }}
                  onClick={() => {
                    if (note.slug) {
                      router.push(`/notes/${note.slug}`);
                    }
                  }}
                >
                  <Flex direction="column" gap="2" p="3">
                    <Flex align="center" gap="2">
                      {note.noteType && (
                        <Badge color="blue" size="1">
                          {note.noteType}
                        </Badge>
                      )}
                      <Text size="1" color="gray">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </Text>
                    </Flex>
                    <Text
                      size="2"
                      style={{
                        whiteSpace: "pre-wrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {note.content}
                    </Text>
                    {note.tags && note.tags.length > 0 && (
                      <Flex gap="1" wrap="wrap">
                        {note.tags.map((tag, idx) => (
                          <Badge key={idx} variant="soft" size="1">
                            {tag}
                          </Badge>
                        ))}
                      </Flex>
                    )}
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Flex>
        </Card>
      )}

      {/* User Stories */}
      <Card>
        <Flex direction="column" gap="3" p="4">
          <Flex justify="between" align="center">
            <Heading size="4">
              Stories {goal.userStories ? `(${goal.userStories.length})` : ""}
            </Heading>
            <GlassButton
              variant="primary"
              size="medium"
              onClick={handleAddStory}
            >
              Add Story
            </GlassButton>
          </Flex>

          {goal.userStories && goal.userStories.length > 0 ? (
            <Flex direction="column" gap="2">
              {goal.userStories.map((story) => (
                <Card
                  key={story.id}
                  style={{
                    backgroundColor: "var(--gray-2)",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push(`/stories/${story.id}`)}
                >
                  <Flex direction="column" gap="2" p="3">
                    <Flex align="center" gap="2">
                      <Text size="1" color="gray">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </Text>
                      <Text size="1" color="gray">
                        by {story.createdBy}
                      </Text>
                    </Flex>
                    <Text
                      size="2"
                      style={{
                        whiteSpace: "pre-wrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {story.content}
                    </Text>
                  </Flex>
                </Card>
              ))}
            </Flex>
          ) : (
            <Text size="2" color="gray">
              No stories yet. Click "Add Story" to create one.
            </Text>
          )}
        </Flex>
      </Card>

      {/* Linked Research */}
      <Card>
        <Flex direction="column" gap="3" p="4">
          <Flex justify="between" align="center">
            <Heading size="4">
              Research {goal.research ? `(${goal.research.length})` : ""}
            </Heading>
            <GlassButton
              variant="primary"
              size="medium"
              loading={generatingResearch}
              onClick={handleGenerateResearch}
            >
              <MagnifyingGlassIcon />
              Generate Research
            </GlassButton>
          </Flex>

          {researchMessage && (
            <Text
              size="2"
              color={researchMessage.type === "success" ? "green" : "red"}
            >
              {researchMessage.text}
            </Text>
          )}

          {goal.research && goal.research.length > 0 ? (
            <Accordion.Root type="multiple" style={{ width: "100%" }}>
              {goal.research.map((paper, idx) => (
                <Accordion.Item
                  key={paper.id}
                  value={`research-${idx}`}
                  style={{
                    borderBottom: "1px solid var(--gray-6)",
                    paddingBottom: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <Accordion.Header style={{ all: "unset" }}>
                    <Accordion.Trigger
                      className="AccordionTrigger"
                      style={{
                        all: "unset",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "12px 0",
                        cursor: "pointer",
                        gap: "8px",
                      }}
                    >
                      <Flex direction="column" gap="1" style={{ flex: 1 }}>
                        <Text size="3" weight="medium">
                          {paper.title}
                        </Text>
                        <Flex gap="2" align="center">
                          {paper.year && (
                            <Badge size="1" variant="soft">
                              {paper.year}
                            </Badge>
                          )}
                          {paper.authors && paper.authors.length > 0 && (
                            <Text size="1" color="gray">
                              {paper.authors.slice(0, 3).join(", ")}
                              {paper.authors.length > 3 && " et al."}
                            </Text>
                          )}
                        </Flex>
                      </Flex>
                      <ChevronDownIcon
                        className="AccordionChevron"
                        style={{
                          transition: "transform 300ms",
                        }}
                        aria-hidden
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="AccordionContent">
                    <div className="AccordionContentText">
                      <Flex direction="column" gap="2">
                        {paper.journal && (
                          <Text
                            size="2"
                            color="gray"
                            style={{ fontStyle: "italic" }}
                          >
                            {paper.journal}
                          </Text>
                        )}
                        {paper.url && (
                          <Link href={paper.url} target="_blank" size="2">
                            View Paper →
                          </Link>
                        )}
                      </Flex>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          ) : (
            <Text size="2" color="gray">
              No research yet. Click &ldquo;Generate Research&rdquo; to find
              relevant therapeutic papers for this goal.
            </Text>
          )}
        </Flex>
      </Card>
    </Flex>
  );
}

const DynamicGoalPageContent = dynamic(() => Promise.resolve(GoalPageContent), {
  ssr: false,
});

export default function GoalPage() {
  const router = useRouter();
  const params = useParams();
  const goalId = parseInt(params.id as string);
  const { user } = useUser();

  const { data } = useGetGoalQuery({
    variables: { id: goalId },
    skip: !goalId,
  });

  const goal = data?.goal;

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
            onClick={() => router.push("/goals")}
          >
            <ArrowLeftIcon />
            Goals
          </GlassButton>

          <Separator orientation="vertical" />

          <Box minWidth="0" style={{ flex: 1 }}>
            <Heading size="8" weight="bold" truncate>
              {goal?.title || "Goal Details"}
            </Heading>
          </Box>
        </Flex>
      </Box>

      <Box style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <DynamicGoalPageContent />
      </Box>
    </Flex>
  );
}
