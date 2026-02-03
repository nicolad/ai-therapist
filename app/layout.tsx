import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Therapist",
  description:
    "Evidence-based therapeutic goal management and audio content generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
