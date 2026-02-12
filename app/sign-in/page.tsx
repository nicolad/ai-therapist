"use client";

import { authClient } from "@/src/auth/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  Button,
  Callout,
} from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);

    try {
      await authClient.signIn.email(
        { email, password },
        {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            setError(ctx.error?.message || "Sign in failed");
          },
        },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex align="center" justify="center" style={{ minHeight: "100vh" }} p="4">
      <Card size="4" style={{ maxWidth: 450, width: "100%" }}>
        <Flex direction="column" gap="4">
          <Flex direction="column" gap="2">
            <Heading size="6">Sign In</Heading>
            <Text size="2" color="gray">
              Access your therapeutic goals and notes
            </Text>
          </Flex>

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="medium" htmlFor="email">
                  Email address
                </Text>
                <TextField.Root
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="medium" htmlFor="password">
                  Password
                </Text>
                <TextField.Root
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Flex>

              {error && (
                <Callout.Root color="red" size="1">
                  <Callout.Icon>
                    <ExclamationTriangleIcon />
                  </Callout.Icon>
                  <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
              )}

              <Button type="submit" disabled={isLoading} size="3">
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <Text align="center" size="2">
                <Text color="gray">Don't have an account?</Text>{" "}
                <Link href="/sign-up" style={{ color: "var(--accent-9)" }}>
                  Sign up
                </Link>
              </Text>
            </Flex>
          </form>
        </Flex>
      </Card>
    </Flex>
  );
}
