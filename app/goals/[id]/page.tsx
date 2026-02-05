"use client";

import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Flex,
  Heading,
  Text,
  Card,
  Button,
  Badge,
  Spinner,
  Link,
} from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useGetGoalQuery } from "@/app/__generated__/hooks";
import "./accordion.css";

function GoalPageContent() {
  const router = useRouter();
  const params = useParams();
  const goalId = parseInt(params.id as string);
  const userId = "demo-user";

  const { data, loading, error } = useGetGoalQuery({
    variables: { id: goalId, userId },
    skip: !goalId,
  });

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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "blue";
      default:
        return "gray";
    }
  };

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

  return (
    <Flex direction="column" gap="4">
      {/* Main Goal Card */}
      <Card style={{ backgroundColor: "var(--indigo-3)" }}>
        <Flex direction="column" gap="4" p="1">
          <Flex justify="between" align="start" gap="3">
            <Heading size="7">{goal.title}</Heading>
            <Flex gap="2">
              <Badge color={getStatusColor(goal.status)} size="2">
                {goal.status}
              </Badge>
              <Badge color={getPriorityColor(goal.priority)} size="2">
                {goal.priority} priority
              </Badge>
            </Flex>
          </Flex>

          {goal.description && (
            <Text size="3" style={{ whiteSpace: "pre-wrap" }}>
              {goal.description}
            </Text>
          )}

          <Flex gap="4" wrap="wrap">
            {goal.targetDate && (
              <Flex direction="column" gap="1">
                <Text size="1" color="gray" weight="medium">
                  Target Date
                </Text>
                <Text size="2">
                  {new Date(goal.targetDate).toLocaleDateString()}
                </Text>
              </Flex>
            )}
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

  return (
    <Flex direction="column" gap="6">
      <Flex align="center" gap="3">
        <Button
          variant="ghost"
          onClick={() => router.push("/goals")}
          style={{ cursor: "pointer" }}
        >
          <ArrowLeftIcon width="18" height="18" />
          Back to Goals
        </Button>
        <Heading size="8">Goal Details</Heading>
      </Flex>

      <DynamicGoalPageContent />
    </Flex>
  );
}
