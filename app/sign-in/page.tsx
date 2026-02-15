import { SignIn } from "@clerk/nextjs";
import { Flex } from "@radix-ui/themes";

export default function SignInPage() {
  return (
    <Flex align="center" justify="center" style={{ minHeight: "60vh" }} p="4">
      <SignIn />
    </Flex>
  );
}
