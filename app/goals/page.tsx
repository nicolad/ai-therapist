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
  Spinner,
  Select,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useGetGoalsQuery } from "@/app/__generated__/hooks";
import { Header } from "../components/Header";

function GoalsListContent() {
  const router = useRouter();
  const userId = "demo-user";
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  const { data, loading, error, refetch } = useGetGoalsQuery({
    variables: {
      userId,
      status: statusFilter,
    },
  });

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
        <Spinner size="3" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Card>
        <Flex direction="column" gap="3" p="4">
          <Text color="red">{error.message}</Text>
          <Button onClick={() => refetch()}>Retry</Button>
        </Flex>
      </Card>
    );
  }

  const goals = data?.goals || [];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "blue";
      default:
        return "gray";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "green";
      case "completed":
        return "blue";
      case "paused":
        return "orange";
      case "archived":
        return "gray";
      default:
        return "gray";
    }
  };

  return (
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center" wrap="wrap" gap="3">
        <Heading size="5">All Goals ({goals.length})</Heading>
        <Flex gap="3" align="center">
          <Select.Root
            value={statusFilter || "all"}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? undefined : value)
            }
          >
            <Select.Trigger placeholder="Filter by status" />
            <Select.Content>
              <Select.Item value="all">All Statuses</Select.Item>
              <Select.Item value="active">Active</Select.Item>
              <Select.Item value="completed">Completed</Select.Item>
              <Select.Item value="paused">Paused</Select.Item>
              <Select.Item value="archived">Archived</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      {goals.length === 0 ? (
        <Card>
          <Flex direction="column" gap="2" p="4" align="center">
            <Text color="gray">No goals found</Text>
            <Text size="2" color="gray">
              {statusFilter
                ? `No ${statusFilter} goals yet`
                : "Create your first goal to get started"}
            </Text>
          </Flex>
        </Card>
      ) : (
        <Flex direction="column" gap="3">
          {goals.map((goal) => (
            <Card
              key={goal.id}
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/goals/${goal.id}`)}
            >
              <Flex direction="column" gap="3" p="4">
                <Flex justify="between" align="start" gap="3">
                  <Flex direction="column" gap="2" style={{ flex: 1 }}>
                    <Heading size="4">{goal.title}</Heading>
                    {goal.description && (
                      <Text
                        size="2"
                        color="gray"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {goal.description}
                      </Text>
                    )}
                  </Flex>
                  <Flex direction="column" gap="2" align="end">
                    <Badge
                      color={getStatusColor(goal.status)}
                      variant="soft"
                      size="2"
                    >
                      {goal.status}
                    </Badge>
                    <Badge
                      color={getPriorityColor(goal.priority)}
                      variant="soft"
                      size="1"
                    >
                      {goal.priority}
                    </Badge>
                  </Flex>
                </Flex>

                <Flex gap="4" align="center" wrap="wrap">
                  {goal.notes && goal.notes.length > 0 && (
                    <Flex align="center" gap="2">
                      <Badge color="indigo" variant="outline" size="1">
                        {goal.notes.length} note
                        {goal.notes.length !== 1 ? "s" : ""}
                      </Badge>
                    </Flex>
                  )}
                  {goal.targetDate && (
                    <Text size="1" color="gray">
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </Text>
                  )}
                  <Text size="1" color="gray">
                    Created {new Date(goal.createdAt).toLocaleDateString()}
                  </Text>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}
    </Flex>
  );
}

const DynamicGoalsListContent = dynamic(
  () => Promise.resolve(GoalsListContent),
  { ssr: false }
);

export default function GoalsPage() {
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
          <Heading size="8">Goals</Heading>
          <DynamicGoalsListContent />
        </Flex>
      </Container>
    </Theme>
  );
}
