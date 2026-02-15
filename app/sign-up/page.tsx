import { SignUp } from "@clerk/nextjs";
import { Flex } from "@radix-ui/themes";

export default function SignUpPage() {
  return (
    <Flex align="center" justify="center" style={{ minHeight: "60vh" }} p="4">
      <SignUp />
    </Flex>
  );
}
