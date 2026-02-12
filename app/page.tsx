"use client";

import {
  Flex,
  Heading,
  Text,
  Card,
  Button,
  Badge,
  Separator,
  Grid,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/auth/client";
import {
  RocketIcon,
  FileTextIcon,
  MagnifyingGlassIcon,
  CheckCircledIcon,
  SpeakerLoudIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  return (
    <Flex direction="column" gap="8">
      {/* Hero Section */}
      <Card size="4" style={{ background: "var(--indigo-3)" }}>
        <Flex direction="column" gap="4" align="center" py="6">
          <Badge size="2" variant="soft" color="indigo">
            AI-Powered Therapeutic Platform
          </Badge>
          <Heading size="9" align="center" style={{ maxWidth: "800px" }}>
            Research-Backed Therapy Notes & Reflections
          </Heading>
          <Text
            size="4"
            align="center"
            color="gray"
            style={{ maxWidth: "600px" }}
          >
            Connect your therapeutic journey with evidence-based research.
            Generate insights, verify claims, and create personalized audio
            content.
          </Text>

          {session && (
            <Text size="3" color="indigo" weight="medium">
              Welcome back, {session.user.name || session.user.email}!
            </Text>
          )}

          <Flex gap="3" mt="2">
            {isPending ? (
              <>
                <Button size="3" disabled loading>
                  Loading...
                </Button>
                <Button size="3" variant="soft" disabled>
                  Loading...
                </Button>
              </>
            ) : !session ? (
              <>
                <Button
                  size="3"
                  onClick={() => router.push("/sign-up")}
                  color="indigo"
                >
                  Get Started
                </Button>
                <Button
                  size="3"
                  variant="soft"
                  onClick={() => router.push("/sign-in")}
                >
                  Sign In
                </Button>
              </>
            ) : (
              <>
                <Button size="3" onClick={() => router.push("/goals")}>
                  <RocketIcon />
                  Explore Goals
                </Button>
                <Button
                  size="3"
                  variant="soft"
                  onClick={() => router.push("/notes")}
                >
                  <FileTextIcon />
                  View Notes
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Card>

      {/* Features Grid */}
      <Flex direction="column" gap="4">
        <Heading size="6">Key Features</Heading>
        <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="4">
          <Card
            style={{ cursor: "pointer" }}
            onClick={() => router.push(session ? "/goals" : "/sign-up")}
          >
            <Flex direction="column" gap="3" p="2">
              <Flex align="center" gap="2">
                <RocketIcon width="24" height="24" color="var(--indigo-9)" />
                <Heading size="4">Therapeutic Goals</Heading>
              </Flex>
              <Text color="gray">
                Create and track therapeutic goals with priority levels, target
                dates, and comprehensive status management.
              </Text>
              <Button variant="soft" style={{ marginTop: "auto" }}>
                {session ? "Manage Goals →" : "Get Started →"}
              </Button>
            </Flex>
          </Card>

          <Card
            style={{ cursor: "pointer" }}
            onClick={() => router.push(session ? "/notes" : "/sign-up")}
          >
            <Flex direction="column" gap="3" p="2">
              <Flex align="center" gap="2">
                <FileTextIcon width="24" height="24" color="var(--indigo-9)" />
                <Heading size="4">Notes & Reflections</Heading>
              </Flex>
              <Text color="gray">
                Document your journey with rich notes, tags, and connections to
                research papers for evidence-based insights.
              </Text>
              <Button variant="soft" style={{ marginTop: "auto" }}>
                {session ? "View Notes →" : "Get Started →"}
              </Button>
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" gap="3" p="2">
              <Flex align="center" gap="2">
                <MagnifyingGlassIcon
                  width="24"
                  height="24"
                  color="var(--indigo-9)"
                />
                <Heading size="4">Research Integration</Heading>
              </Flex>
              <Text color="gray">
                Automatically connect goals with peer-reviewed research from
                PubMed, CrossRef, Semantic Scholar, and more.
              </Text>
              <Badge variant="soft" color="green" style={{ marginTop: "auto" }}>
                7+ Data Sources
              </Badge>
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" gap="3" p="2">
              <Flex align="center" gap="2">
                <CheckCircledIcon
                  width="24"
                  height="24"
                  color="var(--indigo-9)"
                />
                <Heading size="4">Claim Verification</Heading>
              </Flex>
              <Text color="gray">
                AI-powered claim cards extract and verify statements against
                research literature with confidence scores.
              </Text>
              <Badge variant="soft" color="blue" style={{ marginTop: "auto" }}>
                Evidence-Based
              </Badge>
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" gap="3" p="2">
              <Flex align="center" gap="2">
                <SpeakerLoudIcon
                  width="24"
                  height="24"
                  color="var(--indigo-9)"
                />
                <Heading size="4">Audio Generation</Heading>
              </Flex>
              <Text color="gray">
                Generate therapeutic audio content with ElevenLabs
                text-to-speech in multiple languages.
              </Text>
              <Badge
                variant="soft"
                color="purple"
                style={{ marginTop: "auto" }}
              >
                Multi-Language
              </Badge>
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" gap="3" p="2">
              <Flex align="center" gap="2">
                <LightningBoltIcon
                  width="24"
                  height="24"
                  color="var(--indigo-9)"
                />
                <Heading size="4">AI Workflows</Heading>
              </Flex>
              <Text color="gray">
                Powered by Mastra for async research generation, therapeutic
                questions, and long-form synthesis.
              </Text>
              <Badge
                variant="soft"
                color="orange"
                style={{ marginTop: "auto" }}
              >
                Async Jobs
              </Badge>
            </Flex>
          </Card>
        </Grid>
      </Flex>

      <Separator size="4" />

      {/* Tech Stack */}
      <Flex direction="column" gap="4">
        <Heading size="6">Built With</Heading>
        <Card>
          <Flex direction="column" gap="3" p="4">
            <Grid columns={{ initial: "2", md: "4" }} gap="4">
              <Flex direction="column" gap="1">
                <Text weight="bold" size="2">
                  Frontend
                </Text>
                <Text size="2" color="gray">
                  Next.js 15
                </Text>
                <Text size="2" color="gray">
                  React 19
                </Text>
                <Text size="2" color="gray">
                  Radix UI
                </Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold" size="2">
                  Backend
                </Text>
                <Text size="2" color="gray">
                  GraphQL
                </Text>
                <Text size="2" color="gray">
                  Apollo Server
                </Text>
                <Text size="2" color="gray">
                  Turso (LibSQL)
                </Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold" size="2">
                  AI & Services
                </Text>
                <Text size="2" color="gray">
                  OpenAI
                </Text>
                <Text size="2" color="gray">
                  ElevenLabs
                </Text>
                <Text size="2" color="gray">
                  Mastra
                </Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold" size="2">
                  Database
                </Text>
                <Text size="2" color="gray">
                  Drizzle ORM
                </Text>
                <Text size="2" color="gray">
                  SQLite
                </Text>
                <Text size="2" color="gray">
                  Edge-Ready
                </Text>
              </Flex>
            </Grid>
          </Flex>
        </Card>
      </Flex>

      {/* Quick Actions */}
      <Flex direction="column" gap="4">
        <Heading size="6">Get Started</Heading>
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          <Card style={{ background: "var(--violet-3)" }}>
            <Flex direction="column" gap="3" p="4">
              <Heading size="4">
                {session ? "Create Your First Goal" : "Start Your Journey"}
              </Heading>
              <Text color="gray">
                {session
                  ? "Start your therapeutic journey by setting meaningful goals and connecting them with evidence-based research."
                  : "Sign up to create therapeutic goals backed by research and track your progress."}
              </Text>
              <Button
                onClick={() => router.push(session ? "/goals" : "/sign-up")}
                style={{ marginTop: "1rem" }}
              >
                {session ? "Create Goal" : "Sign Up"}
              </Button>
            </Flex>
          </Card>
          <Card style={{ background: "var(--blue-3)" }}>
            <Flex direction="column" gap="3" p="4">
              <Heading size="4">
                {session ? "Browse Your Notes" : "Explore Features"}
              </Heading>
              <Text color="gray">
                {session
                  ? "View all your therapeutic notes, reflections, and claim verifications in one organized place."
                  : "Discover research-backed insights, claim verification, and AI-powered audio content."}
              </Text>
              <Button
                onClick={() => router.push(session ? "/notes" : "/sign-in")}
                style={{ marginTop: "1rem" }}
                variant={session ? "solid" : "soft"}
              >
                {session ? "View Notes" : "Learn More"}
              </Button>
            </Flex>
          </Card>
        </Grid>
      </Flex>
    </Flex>
  );
}
