import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AltAI Hub – Proof of Skill",
  description: "Skill journeys, real challenges, verified portfolio, jobs and prizes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
