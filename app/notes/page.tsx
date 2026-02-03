"use client";

import {
  Theme,
  Container,
  Flex,
  Heading,
  Text,
  Card,
  Button,
} from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const NotesList = dynamic(() => import("../components/NotesList"), {
  ssr: false,
});

export default function NotesPage() {
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
            <NotesList entityId={1} entityType="user" userId="demo-user" />
          </Card>
        </Flex>
      </Container>
    </Theme>
  );
}
