"use client";

import { useState } from "react";
import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  TextArea,
  Select,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { useCreateGoalMutation } from "@/app/__generated__/hooks";
import { authClient } from "@/src/auth/client";

export default function AddGoalButton() {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [createGoal, { loading }] = useCreateGoalMutation({
    onCompleted: () => {
      setOpen(false);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setTargetDate("");
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
    refetchQueries: ["GetGoals"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!session?.user?.id) {
      setError("You must be logged in to create a goal");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a goal title");
      return;
    }

    try {
      await createGoal({
        variables: {
          input: {
            familyMemberId: 1, // Default family member
            title: title.trim(),
            description: description.trim() || undefined,
            priority,
            targetDate: targetDate || undefined,
          },
        },
      });
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button size="3">
          <PlusIcon width="16" height="16" />
          Add Goal
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>Create New Goal</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Add a new therapeutic goal to track your progress.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Title *
              </Text>
              <TextField.Root
                placeholder="Enter goal title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Description
              </Text>
              <TextArea
                placeholder="Describe your goal (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                disabled={loading}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Priority
              </Text>
              <Select.Root
                value={priority}
                onValueChange={setPriority}
                disabled={loading}
              >
                <Select.Trigger placeholder="Select priority" />
                <Select.Content>
                  <Select.Item value="low">Low</Select.Item>
                  <Select.Item value="medium">Medium</Select.Item>
                  <Select.Item value="high">High</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Target Date
              </Text>
              <TextField.Root
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                disabled={loading}
              />
            </label>

            {error && (
              <Text color="red" size="2">
                {error}
              </Text>
            )}

            <Flex gap="3" justify="end" mt="4">
              <Dialog.Close>
                <Button variant="soft" color="gray" disabled={loading}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Goal"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
