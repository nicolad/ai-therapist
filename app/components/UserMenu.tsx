"use client";

import { authClient } from "@/src/auth/client";
import Link from "next/link";
import { Flex, Button, Text, Skeleton } from "@radix-ui/themes";

export default function UserMenu() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <Flex align="center" gap="4">
        <Skeleton width="32px" height="32px" style={{ borderRadius: "50%" }} />
      </Flex>
    );
  }

  if (!session) {
    return (
      <Flex align="center" gap="4">
        <Link href="/sign-in">
          <Button variant="ghost" size="2">
            Sign in
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button size="2">Sign up</Button>
        </Link>
      </Flex>
    );
  }

  return (
    <Flex align="center" gap="4">
      <Text size="2" color="gray">
        {session.user.name || session.user.email}
      </Text>
      <Button
        onClick={() => authClient.signOut()}
        variant="soft"
        color="red"
        size="2"
      >
        Sign out
      </Button>
    </Flex>
  );
}
