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

export default function Home() {
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
          <Flex direction="column" gap="2">
            <Heading size="8">AI Therapist</Heading>
            <Text size="4" color="gray">
              Evidence-based therapeutic goal management and audio content
              generation
            </Text>
          </Flex>

          <Flex gap="4" wrap="wrap">
            <Card style={{ flex: "1", minWidth: "300px" }}>
              <Flex direction="column" gap="3">
                <Heading size="5">Therapeutic Goals</Heading>
                <Text>
                  Manage therapeutic goals with evidence-based research and
                  generate personalized audio content.
                </Text>
                <Button size="3">Get Started</Button>
              </Flex>
            </Card>

            <Card style={{ flex: "1", minWidth: "300px" }}>
              <Flex direction="column" gap="3">
                <Heading size="5">Voice Features</Heading>
                <Text>
                  Generate therapeutic audio with OpenAI or ElevenLabs
                  text-to-speech.
                </Text>
                <Button size="3" variant="outline">
                  Learn More
                </Button>
              </Flex>
            </Card>
          </Flex>

          <Card>
            <Flex direction="column" gap="3">
              <Heading size="4">Features</Heading>
              <Flex direction="column" gap="2">
                <Text>✅ Evidence-based therapy research generation</Text>
                <Text>✅ Multi-language audio content (ElevenLabs)</Text>
                <Text>✅ libSQL storage for conversation history</Text>
                <Text>✅ GraphQL API for goal management</Text>
                <Text>✅ Real-time progress tracking</Text>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Container>
    </Theme>
  );
}
