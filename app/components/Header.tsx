"use client";

import { Flex, Heading, Text, IconButton } from "@radix-ui/themes";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import UserMenu from "./UserMenu";

export function Header() {
  const router = useRouter();

  return (
    <Flex justify="between" align="start" mb="6">
      <Flex
        direction="column"
        gap="1"
        style={{ cursor: "pointer" }}
        onClick={() => router.push("/")}
      >
        <Heading size="6">ResearchThera</Heading>
        <Text size="2" color="gray">
          Research-backed therapy notes and reflections powered by AI
        </Text>
      </Flex>
      <Flex align="center" gap="4">
        <UserMenu />
        <IconButton asChild variant="ghost" size="3" color="gray" highContrast>
          <a
            href="https://github.com/nicolad/research-thera"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubLogoIcon width="20" height="20" />
          </a>
        </IconButton>
      </Flex>
    </Flex>
  );
}
