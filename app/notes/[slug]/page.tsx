"use client";

import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
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

function NotePageContent() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const userId = "demo-user";

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");

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

  return (
    <Flex direction="column" gap="4">
      <Card>
        <Flex direction="column" gap="4">
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Badge color="blue">{note.noteType || "General"}</Badge>
              <Text size="1" color="gray">
                Created {new Date(note.createdAt).toLocaleDateString()}
              </Text>
            </Flex>
            {note.tags && note.tags.length > 0 && (
              <Flex gap="2" wrap="wrap">
                {note.tags.map((tag, idx) => (
                  <Badge key={idx} variant="soft">
                    {tag}
                  </Badge>
                ))}
              </Flex>
            )}
          </Flex>

          <Text style={{ whiteSpace: "pre-wrap" }}>{note.content}</Text>

          {note.linkedResearch && note.linkedResearch.length > 0 && (
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
          )}

          {note.updatedAt !== note.createdAt && (
            <Text size="1" color="gray">
              Last updated {new Date(note.updatedAt).toLocaleDateString()}
            </Text>
          )}
        </Flex>
      </Card>
    </Flex>
  );
}

const DynamicNotePageContent = dynamic(() => Promise.resolve(NotePageContent), {
  ssr: false,
});

export default function NotePage() {
  const router = useRouter();

  return (
    <Theme
      appearance="dark"
      accentColor="indigo"
      grayColor="slate"
      radius="medium"
      scaling="100%"
    >
      <Container size="3" style={{ padding: "2rem" }}>
        <Flex direction="column" gap="6">
          <Flex align="center" gap="3">
            <Button
              variant="ghost"
              onClick={() => router.push("/notes")}
              style={{ cursor: "pointer" }}
            >
              <ArrowLeftIcon width="18" height="18" />
              Back to Notes
            </Button>
            <Heading size="8">Note Details</Heading>
          </Flex>

          <DynamicNotePageContent />
        </Flex>
      </Container>
    </Theme>
  );
}
