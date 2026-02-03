"use client";

import { useState } from "react";
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
} from "@radix-ui/themes";
import { ArrowLeftIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  useGetNoteQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "@/app/__generated__/hooks";

function NotePageContent() {
  const router = useRouter();
  const params = useParams();
  const noteId = parseInt(params.id as string);
  const userId = "demo-user";

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");

  const { data, loading, error } = useGetNoteQuery({
    variables: { id: noteId, userId },
    skip: !noteId,
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
          id: noteId,
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
        variables: { id: noteId },
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
          <Flex justify="between" align="start">
            <Flex direction="column" gap="2" style={{ flex: 1 }}>
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
            {!isEditing && (
              <Flex gap="2">
                <Button
                  variant="soft"
                  onClick={handleEdit}
                  disabled={updating || deleting}
                >
                  <Pencil1Icon />
                  Edit
                </Button>
                <Button
                  variant="soft"
                  color="red"
                  onClick={handleDelete}
                  disabled={updating || deleting}
                >
                  <TrashIcon />
                  Delete
                </Button>
              </Flex>
            )}
          </Flex>

          {isEditing ? (
            <Flex direction="column" gap="3">
              <TextArea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Note content..."
                rows={8}
              />
              <TextArea
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="Tags (comma separated)..."
                rows={1}
              />
              <Flex gap="2">
                <Button onClick={handleSave} disabled={updating}>
                  {updating ? <Spinner /> : "Save"}
                </Button>
                <Button
                  variant="soft"
                  onClick={() => setIsEditing(false)}
                  disabled={updating}
                >
                  Cancel
                </Button>
              </Flex>
            </Flex>
          ) : (
            <Text style={{ whiteSpace: "pre-wrap" }}>{note.content}</Text>
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
