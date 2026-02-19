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
} from "@radix-ui/themes";
import { GlassButton } from "@/app/components/GlassButton";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useGetGoalQuery, useCreateSubgoalMutation } from "@/app/__generated__/hooks";
import { useUser } from "@clerk/nextjs";
import "./accordion.css";

function GoalPageContent() {
  const router = useRouter();
  const params = useParams();
  const paramValue = params.id as string;
  const { user } = useUser();
  const [showSubgoalForm, setShowSubgoalForm] = useState(false);
  const [subgoalTitle, setSubgoalTitle] = useState("");
  const [subgoalDescription, setSubgoalDescription] = useState("");

  // Determine if paramValue is a number (ID) or string (slug)
  const isNumericId = /^\d+$/.test(paramValue);
  const goalId = isNumericId ? parseInt(paramValue) : undefined;
  const goalSlug = !isNumericId ? paramValue : undefined;

  const { data, loading, error, refetch } = useGetGoalQuery({
    variables: {
      id: goalId,
      slug: goalSlug,
    },
    skip: !goalId && !goalSlug,
  });

  const [createSubgoal] = useCreateSubgoalMutation();

  const goal = data?.goal;

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

  const handleCreateSubgoal = async () => {
    if (!goal || !subgoalTitle.trim()) return;

    try {
      await createSubgoal({
        variables: {
          input: {
            goalId: goal.id,
            title: subgoalTitle,
            description: subgoalDescription || null,
          },
        },
      });
      setShowSubgoalForm(false);
      setSubgoalTitle("");
      setSubgoalDescription("");
      refetch();
    } catch (error) {
      console.error("Failed to create subgoal:", error);
    }
  };

  return (
    <Flex direction="column" gap="4">
      {/* Main Goal Card */}
      <Card style={{ backgroundColor: "var(--indigo-3)" }}>
        <Flex direction="column" gap="4" p="1">
          <Flex justify="between" align="start" gap="3">
            <Heading size="7">{goal.title}</Heading>
            <Badge color={getStatusColor(goal.status)} size="2">
              {goal.status}
            </Badge>
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

      {/* Subgoals */}
      <Card>
        <Flex direction="column" gap="3" p="4">
          <Flex justify="between" align="center">
            <Heading size="4">
              Subgoals {goal.subgoals ? `(${goal.subgoals.length})` : ""}
            </Heading>
            <GlassButton
              variant="primary"
              size="medium"
              onClick={() => setShowSubgoalForm(!showSubgoalForm)}
            >
              Add Subgoal
            </GlassButton>
          </Flex>

          {showSubgoalForm && (
            <Card style={{ backgroundColor: "var(--indigo-2)" }}>
              <Flex direction="column" gap="3" p="4">
                <input
                  type="text"
                  placeholder="Subgoal title"
                  value={subgoalTitle}
                  onChange={(e) => setSubgoalTitle(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--gray-6)",
                    fontSize: "14px",
                  }}
                />
                <textarea
                  placeholder="Description (optional)"
                  value={subgoalDescription}
                  onChange={(e) => setSubgoalDescription(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--gray-6)",
                    fontSize: "14px",
                    minHeight: "80px",
                    fontFamily: "inherit",
                  }}
                />
                <Flex gap="2">
                  <GlassButton
                    variant="primary"
                    size="medium"
                    onClick={handleCreateSubgoal}
                  >
                    Create Subgoal
                  </GlassButton>
                  <GlassButton
                    variant="secondary"
                    size="medium"
                    onClick={() => {
                      setShowSubgoalForm(false);
                      setSubgoalTitle("");
                      setSubgoalDescription("");
                    }}
                  >
                    Cancel
                  </GlassButton>
                </Flex>
              </Flex>
            </Card>
          )}

          {goal.subgoals && goal.subgoals.length > 0 ? (
            <Flex direction="column" gap="2">
              {goal.subgoals.map((subgoal) => (
                <Card
                  key={subgoal.id}
                  style={{
                    backgroundColor: "var(--gray-2)",
                  }}
                >
                  <Flex direction="column" gap="2" p="3">
                    <Flex justify="between" align="start" gap="2">
                      <Heading size="3">{subgoal.title}</Heading>
                      <Badge color="blue" size="1">
                        {subgoal.status}
                      </Badge>
                    </Flex>
                    {subgoal.description && (
                      <Text size="2" color="gray">
                        {subgoal.description}
                      </Text>
                    )}
                    <Text size="1" color="gray">
                      Created {new Date(subgoal.createdAt).toLocaleDateString()}
                    </Text>
                  </Flex>
                </Card>
              ))}
            </Flex>
          ) : (
            !showSubgoalForm && (
              <Text size="2" color="gray">
                No subgoals yet. Click "Add Subgoal" to create one.
              </Text>
            )
          )}
        </Flex>
      </Card>

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
      {goal.research && goal.research.length > 0 && (
        <Card>
          <Flex direction="column" gap="3" p="4">
            <Heading size="4">Research ({goal.research.length})</Heading>
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
          </Flex>
        </Card>
      )}
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
