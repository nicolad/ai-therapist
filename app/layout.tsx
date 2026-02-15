import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import { Container, Theme } from "@radix-ui/themes";
import { ClerkProvider } from "@clerk/nextjs";
import { ApolloProvider } from "./providers/ApolloProvider";
import { Header } from "./components/Header";

export const metadata: Metadata = {
  title: "ResearchThera.com",
  description: "Research-based therapeutic notes and reflections powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#6366f1",
          colorBackground: "#0f172a",
          colorInputBackground: "#1e293b",
          colorInputText: "#f1f5f9",
          colorText: "#f1f5f9",
          colorTextSecondary: "#94a3b8",
          colorDanger: "#ef4444",
          colorSuccess: "#10b981",
          borderRadius: "0.5rem",
          fontSize: "1rem",
        },
      }}
    >
      <html lang="en" className="dark">
        <body>
          <Theme
            appearance="dark"
            accentColor="indigo"
            grayColor="slate"
            radius="medium"
            scaling="100%"
          >
            <ApolloProvider>
              <Container size="3" style={{ padding: "2rem" }}>
                <Header />
                {children}
              </Container>
            </ApolloProvider>
          </Theme>
        </body>
      </html>
    </ClerkProvider>
  );
}
