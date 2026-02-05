"use client";

import { Flex, Heading, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  return (
    <Flex
      direction="column"
      gap="1"
      mb="6"
      style={{ cursor: "pointer" }}
      onClick={() => router.push("/")}
    >
      <Heading size="6">ResearchThera</Heading>
      <Text size="2" color="gray">
        Research-backed therapy notes and reflections powered by AI
      </Text>
    </Flex>
  );
}
