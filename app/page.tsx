"use client";

import { Flex, Heading, Text, Card, Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Flex direction="column" gap="6">
      <Card style={{ flex: "1", minWidth: "300px" }}>
        <Flex direction="column" gap="3">
          <Heading size="5">Therapeutic Goals</Heading>
          <Text>
            Manage therapeutic goals with evidence-based research and generate
            personalized audio content.
          </Text>
        </Flex>
      </Card>
      <Card
        style={{ flex: "1", minWidth: "300px", cursor: "pointer" }}
        onClick={() => router.push("/notes")}
      >
        <Flex direction="column" gap="3">
          <Heading size="5">Notes</Heading>
          <Text>View and manage your therapeutic notes and reflections.</Text>
          <Button variant="soft" style={{ marginTop: "0.5rem" }}>
            View Notes →
          </Button>
        </Flex>
      </Card>
      <Card style={{ flex: "1", minWidth: "300px" }}>
        <Flex direction="column" gap="3">
          <Heading size="5">Voice Features</Heading>
          <Text>
            Generate therapeutic audio with ElevenLabs text-to-speech.
          </Text>
        </Flex>
      </Card>
      <Card>
        <Flex direction="column" gap="3">
          <Heading size="4">Features</Heading>
          <Flex direction="column" gap="2">
            <Text>✅ Evidence-based therapy research generation</Text>
            <Text>✅ Multi-language audio content (ElevenLabs)</Text>
            <Text>✅ libSQL storage for conversation history</Text>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
