"use client";

import {
  Theme,
  Container,
  Flex,
  Heading,
  Text,
  Card,
  Button,
  Badge,
  Spinner,
} from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useGetAllNotesQuery } from "../__generated__/hooks";
import { Header } from "../components/Header";

export default function NotesPage() {
  const router = useRouter();
  const userId = "demo-user";

  const { data, loading, error } = useGetAllNotesQuery({
    variables: { userId },
  });

  const notes = data?.allNotes || [];

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
          <Header />
          <Flex align="end" gap="3">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              style={{ cursor: "pointer" }}
            >
              <ArrowLeftIcon width="18" height="18" />
              Back
            </Button>
            <Flex direction="column" gap="1" style={{ flex: 1 }}>
              <Heading size="8">Notes</Heading>
              <Text size="3" color="gray">
                Manage your therapeutic notes and reflections
              </Text>
            </Flex>
          </Flex>

          <Card>
            {loading && (
              <Flex justify="center" align="center" p="6">
                <Spinner size="3" />
              </Flex>
            )}

            {error && (
              <Flex direction="column" align="center" p="6" gap="2">
                <Text color="red">Error loading notes</Text>
                <Text size="1" color="gray">
                  {error.message}
                </Text>
              </Flex>
            )}

            {!loading && !error && notes.length === 0 && (
              <Flex direction="column" align="center" p="6" gap="3">
                <Text size="4" weight="bold">
                  Notes ({notes.length})
                </Text>
                <Text color="gray">No notes yet</Text>
                <Text size="2" color="gray">
                  Click "Add Note" to create your first note
                </Text>
              </Flex>
            )}

            {!loading && !error && notes.length > 0 && (
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Heading size="4">Notes ({notes.length})</Heading>
                </Flex>

                <Flex direction="column" gap="3">
                  {notes.map((note) => (
                    <Card
                      key={note.id}
                      onClick={() =>
                        router.push(
                          note.slug
                            ? `/notes/${note.slug}`
                            : `/notes/${note.id}`,
                        )
                      }
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--gray-3)";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--gray-2)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <Flex direction="column" gap="2">
                        <Flex justify="between" align="start">
                          <Heading size="3">
                            {note.title || "Untitled Note"}
                          </Heading>
                          <Badge variant="soft" size="1">
                            {note.entityType}
                          </Badge>
                        </Flex>
                        <Text size="2" color="gray" style={{ lineHeight: 1.5 }}>
                          {note.content.slice(0, 150)}
                          {note.content.length > 150 && "..."}
                        </Text>
                        <Flex gap="2" align="center" wrap="wrap">
                          {note.tags?.map((tag, idx) => (
                            <Badge key={idx} variant="outline" size="1">
                              {tag}
                            </Badge>
                          ))}
                          <Text size="1" color="gray">
                            {new Date(note.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </Text>
                        </Flex>
                        {note.goal && (
                          <Flex gap="2" align="center">
                            <Text size="1" color="gray">
                              Goal:
                            </Text>
                            <Text size="1" weight="medium">
                              {note.goal.title}
                            </Text>
                          </Flex>
                        )}
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              </Flex>
            )}
          </Card>
        </Flex>
      </Container>
    </Theme>
  );
}
