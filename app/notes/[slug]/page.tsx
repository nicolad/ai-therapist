"use client";

import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Separator from "@radix-ui/react-separator";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
  Theme,
  Container,
  Flex,
  Heading,
  Text,
  Card,
  Button,
  Badge,
  TextArea,
  Spinner,
  Link,
  IconButton,
  Grid,
  Box,
} from "@radix-ui/themes";
import { ArrowLeftIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  useGetNoteQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "@/app/__generated__/hooks";
import "./accordion.css";

// Utility to format relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function NotePageContent() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const userId = "demo-user";

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { data, loading, error } = useGetNoteQuery({
    variables: { slug, userId },
    skip: !slug,
  });

  const [updateNote, { loading: updating }] = useUpdateNoteMutation({
    refetchQueries: ["GetNote"],
  });

  const [deleteNote, { loading: deleting }] = useDeleteNoteMutation();

  const note = data?.note;

  const handleEdit = () => {
    if (note) {
      setEditContent(note.content);
      setEditTags(note.tags?.join(", ") || "");
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!note) return;

    try {
      await updateNote({
        variables: {
          id: note.id,
          input: {
            content: editContent,
            tags: editTags
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t),
          },
        },
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  };

  const handleDelete = async () => {
    if (!note || !confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote({
        variables: { id: note.id },
      });
      router.push("/notes");
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
        <Spinner size="3" />
      </Flex>
    );
  }

  if (error || !note) {
    return (
      <Card>
        <Text color="red">
          {error ? `Error: ${error.message}` : "Note not found"}
        </Text>
      </Card>
    );
  }

  const shouldTruncateDescription =
    note.goal?.description && note.goal.description.length > 180;
  const displayDescription =
    shouldTruncateDescription && !showFullDescription
      ? note.goal?.description?.slice(0, 180) + "..."
      : note.goal?.description;

  return (
    <Grid
      columns={{ initial: "1", md: "3fr 1fr" }}
      gap="5"
      style={{ alignItems: "start" }}
    >
      <Flex direction="column" gap="4">
        {note.linkedResearch && note.linkedResearch.length > 0 && (
          <Card>
            <Flex direction="column" gap="3">
              <Heading size="4">
                Linked Research ({note.linkedResearch.length})
              </Heading>
              <Accordion.Root type="multiple" style={{ width: "100%" }}>
                {note.linkedResearch.map((research, idx) => (
                  <Accordion.Item
                    key={research.id}
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
                            {research.title}
                          </Text>
                          <Flex gap="2" align="center">
                            {research.year && (
                              <Badge size="1" variant="soft">
                                {research.year}
                              </Badge>
                            )}
                            {research.authors &&
                              research.authors.length > 0 && (
                                <Text size="1" color="gray">
                                  {research.authors.slice(0, 3).join(", ")}
                                  {research.authors.length > 3 && " et al."}
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
                          {research.journal && (
                            <Text
                              size="2"
                              color="gray"
                              style={{ fontStyle: "italic" }}
                            >
                              {research.journal}
                            </Text>
                          )}
                          {research.url && (
                            <Link href={research.url} target="_blank" size="2">
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

      {/* Claim Cards Section */}
      {note.claimCards && note.claimCards.length > 0 && (
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="4">
              Claim Cards ({note.claimCards.length})
            </Heading>
            <Accordion.Root type="multiple" style={{ width: "100%" }}>
              {note.claimCards.map((card, idx) => {
                const verdictColor = {
                  SUPPORTED: "green",
                  CONTRADICTED: "red",
                  MIXED: "orange",
                  INSUFFICIENT: "gray",
                  UNVERIFIED: "gray",
                }[card.verdict] as any;

                const supportingEvidence = card.evidence.filter(
                  (e) => e.polarity === "SUPPORTS"
                );
                const contradictingEvidence = card.evidence.filter(
                  (e) => e.polarity === "CONTRADICTS"
                );
                const mixedEvidence = card.evidence.filter(
                  (e) => e.polarity === "MIXED" || e.polarity === "IRRELEVANT"
                );

                return (
                  <Accordion.Item
                    key={card.id}
                    value={`claim-${idx}`}
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
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "12px 0",
                          cursor: "pointer",
                          gap: "12px",
                        }}
                      >
                        <Flex direction="column" gap="2" style={{ flex: 1 }}>
                          <Text size="3" weight="medium">
                            {card.claim}
                          </Text>
                          <Flex gap="2" align="center" wrap="wrap">
                            <Badge color={verdictColor} variant="soft">
                              {card.verdict}
                            </Badge>
                            <Tooltip.Provider>
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <Badge variant="outline">
                                    {Math.round(card.confidence * 100)}%
                                  </Badge>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content
                                    className="TooltipContent"
                                    sideOffset={5}
                                    style={{
                                      backgroundColor: "var(--gray-12)",
                                      color: "var(--gray-1)",
                                      padding: "8px 12px",
                                      borderRadius: "6px",
                                      fontSize: "13px",
                                      maxWidth: "200px",
                                    }}
                                  >
                                    Confidence score
                                    <Tooltip.Arrow
                                      style={{
                                        fill: "var(--gray-12)",
                                      }}
                                    />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>
                            </Tooltip.Provider>
                            <Badge variant="surface" size="1">
                              {card.evidence.length}{" "}
                              {card.evidence.length === 1 ? "source" : "sources"}
                            </Badge>
                          </Flex>
                        </Flex>
                        <ChevronDownIcon
                          className="AccordionChevron"
                          style={{
                            transition: "transform 300ms",
                            marginTop: "4px",
                          }}
                          aria-hidden
                        />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="AccordionContent">
                      <div className="AccordionContentText">
                        <Flex direction="column" gap="3">
                          {/* Scope (if available) */}
                          {card.scope && (
                            <Flex
                              direction="column"
                              gap="2"
                              p="3"
                              style={{
                                backgroundColor: "var(--gray-3)",
                                borderRadius: "6px",
                              }}
                            >
                              <Text size="2" weight="bold" color="gray">
                                Scope
                              </Text>
                              {card.scope.population && (
                                <Text size="1">
                                  <strong>Population:</strong>{" "}
                                  {card.scope.population}
                                </Text>
                              )}
                              {card.scope.intervention && (
                                <Text size="1">
                                  <strong>Intervention:</strong>{" "}
                                  {card.scope.intervention}
                                </Text>
                              )}
                              {card.scope.outcome && (
                                <Text size="1">
                                  <strong>Outcome:</strong> {card.scope.outcome}
                                </Text>
                              )}
                            </Flex>
                          )}

                          {/* Supporting Evidence */}
                          {supportingEvidence.length > 0 && (
                            <Flex direction="column" gap="2">
                              <Text size="2" weight="bold" color="green">
                                ✓ Supporting Evidence ({supportingEvidence.length})
                              </Text>
                              {supportingEvidence.map((evidence, evidx) => (
                                <Flex
                                  key={evidx}
                                  direction="column"
                                  gap="1"
                                  p="2"
                                  style={{
                                    backgroundColor: "var(--green-2)",
                                    borderLeft: "3px solid var(--green-9)",
                                    borderRadius: "4px",
                                  }}
                                >
                                  <Flex justify="between" align="start">
                                    <Text size="2" weight="medium">
                                      {evidence.paper.title}
                                    </Text>
                                    {evidence.score !== null && evidence.score !== undefined && (
                                      <Badge size="1" variant="soft">
                                        {(evidence.score * 100).toFixed(0)}%
                                      </Badge>
                                    )}
                                  </Flex>
                                  {evidence.paper.authors &&
                                    evidence.paper.authors.length > 0 && (
                                      <Text size="1" color="gray">
                                        {evidence.paper.authors.slice(0, 2).join(", ")}
                                        {evidence.paper.authors.length > 2 && " et al."}
                                        {evidence.paper.year && ` (${evidence.paper.year})`}
                                      </Text>
                                    )}
                                  {evidence.excerpt && (
                                    <Text
                                      size="1"
                                      style={{
                                        fontStyle: "italic",
                                        color: "var(--gray-11)",
                                      }}
                                    >
                                      "{evidence.excerpt}"
                                    </Text>
                                  )}
                                  {evidence.locator?.url && (
                                    <Link
                                      href={evidence.locator.url}
                                      target="_blank"
                                      size="1"
                                    >
                                      View source →
                                    </Link>
                                  )}
                                </Flex>
                              ))}
                            </Flex>
                          )}

                          {/* Contradicting Evidence */}
                          {contradictingEvidence.length > 0 && (
                            <Flex direction="column" gap="2">
                              <Text size="2" weight="bold" color="red">
                                ✗ Contradicting Evidence ({contradictingEvidence.length})
                              </Text>
                              {contradictingEvidence.map((evidence, evidx) => (
                                <Flex
                                  key={evidx}
                                  direction="column"
                                  gap="1"
                                  p="2"
                                  style={{
                                    backgroundColor: "var(--red-2)",
                                    borderLeft: "3px solid var(--red-9)",
                                    borderRadius: "4px",
                                  }}
                                >
                                  <Flex justify="between" align="start">
                                    <Text size="2" weight="medium">
                                      {evidence.paper.title}
                                    </Text>
                                    {evidence.score !== null && evidence.score !== undefined && (
                                      <Badge size="1" variant="soft">
                                        {(evidence.score * 100).toFixed(0)}%
                                      </Badge>
                                    )}
                                  </Flex>
                                  {evidence.paper.authors &&
                                    evidence.paper.authors.length > 0 && (
                                      <Text size="1" color="gray">
                                        {evidence.paper.authors.slice(0, 2).join(", ")}
                                        {evidence.paper.authors.length > 2 && " et al."}
                                        {evidence.paper.year && ` (${evidence.paper.year})`}
                                      </Text>
                                    )}
                                  {evidence.excerpt && (
                                    <Text
                                      size="1"
                                      style={{
                                        fontStyle: "italic",
                                        color: "var(--gray-11)",
                                      }}
                                    >
                                      "{evidence.excerpt}"
                                    </Text>
                                  )}
                                  {evidence.locator?.url && (
                                    <Link
                                      href={evidence.locator.url}
                                      target="_blank"
                                      size="1"
                                    >
                                      View source →
                                    </Link>
                                  )}
                                </Flex>
                              ))}
                            </Flex>
                          )}

                          {/* Mixed/Irrelevant Evidence (collapsed by default) */}
                          {mixedEvidence.length > 0 && (
                            <Flex direction="column" gap="2">
                              <Text size="2" weight="bold" color="gray">
                                Other Evidence ({mixedEvidence.length})
                              </Text>
                              <Text size="1" color="gray">
                                Mixed or inconclusive findings
                              </Text>
                            </Flex>
                          )}
                        </Flex>
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                );
              })}
            </Accordion.Root>
          </Flex>
        </Card>
      )}

      {/* Sidebar */}
      <Flex direction="column" gap="4">
        {/* Related Goal Card */}
        {note.goal && (
          <Card
            style={{
              backgroundColor: "var(--indigo-3)",
              cursor: "pointer",
              border: "1px solid var(--indigo-6)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--indigo-4)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--indigo-3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            onClick={() => router.push(`/goals/${note.goal?.id}`)}
          >
            <Flex direction="column" gap="2">
              <Flex justify="between" align="center">
                <Badge color="indigo" size="1">
                  Related Goal
                </Badge>
                <ChevronRightIcon width="16" height="16" />
              </Flex>
              <Heading size="3" style={{ lineHeight: "1.3" }}>
                {note.goal.title}
              </Heading>
              {note.goal.description && (
                <>
                  <Text size="1" color="gray" style={{ lineHeight: "1.5" }}>
                    {displayDescription}
                  </Text>
                  {shouldTruncateDescription && (
                    <Button
                      variant="ghost"
                      size="1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFullDescription(!showFullDescription);
                      }}
                      style={{ alignSelf: "flex-start", padding: "0" }}
                    >
                      {showFullDescription ? "Show less" : "Show more"}
                    </Button>
                  )}
                </>
              )}
              <Separator.Root
                style={{
                  height: "1px",
                  backgroundColor: "var(--indigo-6)",
                  margin: "4px 0",
                }}
              />
              <Flex gap="2" wrap="wrap" align="center">
                <Badge
                  color={getStatusColor(note.goal.status)}
                  variant="solid"
                  size="1"
                >
                  {note.goal.status}
                </Badge>
                <Badge
                  color={getPriorityColor(note.goal.priority)}
                  variant="outline"
                  size="1"
                >
                  {note.goal.priority}
                </Badge>
                {note.goal.targetDate && (
                  <Text size="1" color="gray">
                    Due {getRelativeTime(note.goal.targetDate)}
                  </Text>
                )}
              </Flex>
            </Flex>
          </Card>
        )}

        {/* Metadata Card */}
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="3">Details</Heading>
            <Separator.Root
              style={{
                height: "1px",
                backgroundColor: "var(--gray-6)",
                margin: "0",
              }}
            />

            {/* Type */}
            <Flex direction="column" gap="1">
              <Text size="1" color="gray" weight="medium">
                Type
              </Text>
              <Badge color="blue" size="1" variant="soft">
                {note.noteType || "General"}
              </Badge>
            </Flex>

            {/* Created */}
            <Flex direction="column" gap="1">
              <Text size="1" color="gray" weight="medium">
                Created
              </Text>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Text size="2" style={{ cursor: "help" }}>
                      {getRelativeTime(note.createdAt)}
                    </Text>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      style={{
                        backgroundColor: "var(--gray-12)",
                        color: "var(--gray-1)",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                      sideOffset={5}
                    >
                      {new Date(note.createdAt).toLocaleString("en-GB", {
                        dateStyle: "full",
                        timeStyle: "short",
                      })}
                      <Tooltip.Arrow style={{ fill: "var(--gray-12)" }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </Flex>

            {/* Updated */}
            {note.updatedAt !== note.createdAt && (
              <Flex direction="column" gap="1">
                <Text size="1" color="gray" weight="medium">
                  Last updated
                </Text>
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Text size="2" style={{ cursor: "help" }}>
                        {getRelativeTime(note.updatedAt)}
                      </Text>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        style={{
                          backgroundColor: "var(--gray-12)",
                          color: "var(--gray-1)",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                        }}
                        sideOffset={5}
                      >
                        {new Date(note.updatedAt).toLocaleString("en-GB", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                        <Tooltip.Arrow style={{ fill: "var(--gray-12)" }} />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </Flex>
            )}

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <>
                <Separator.Root
                  style={{
                    height: "1px",
                    backgroundColor: "var(--gray-6)",
                    margin: "4px 0",
                  }}
                />
                <Flex direction="column" gap="2">
                  <Text size="1" color="gray" weight="medium">
                    Tags
                  </Text>
                  <Flex gap="1" wrap="wrap">
                    {note.tags.map((tag, idx) => (
                      <Badge key={idx} variant="soft" color="gray" size="1">
                        {tag}
                      </Badge>
                    ))}
                  </Flex>
                </Flex>
              </>
            )}
          </Flex>
        </Card>
      </Flex>
    </Grid>
  );
}

const DynamicNotePageContent = dynamic(() => Promise.resolve(NotePageContent), {
  ssr: false,
});

export default function NotePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const userId = "demo-user";

  const { data } = useGetNoteQuery({
    variables: { slug, userId },
    skip: !slug,
  });

  const note = data?.note;

  return (
    <Theme
      appearance="dark"
      accentColor="indigo"
      grayColor="slate"
      radius="medium"
      scaling="100%"
    >
      <Container size="4" style={{ padding: "2rem" }}>
        <Flex direction="column" gap="5">
          {/* Header */}
          <Flex direction="column" gap="1">
            <Button
              variant="ghost"
              onClick={() => router.push("/notes")}
              style={{ alignSelf: "flex-start", padding: "0" }}
            >
              <ArrowLeftIcon width="14" height="14" />
              <Text size="2" color="gray">
                Back to Notes
              </Text>
            </Button>
            {note?.title ? (
              <>
                <Heading size="7">{note.title}</Heading>
              </>
            ) : (
              <Heading size="6" style={{ marginTop: "8px" }}>
                Note details
              </Heading>
            )}
          </Flex>

          <DynamicNotePageContent />
        </Flex>
      </Container>
    </Theme>
  );
}
