import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "nibame — Your Second Brain",
  description:
    "nibame is a privacy-first personal context engine. Capture, connect, and retrieve everything across your personal and work life.",
  keywords: ["second brain", "personal context engine", "knowledge graph", "productivity", "privacy"],
  authors: [{ name: "nibame" }],
  openGraph: {
    title: "nibame — Your Second Brain",
    description: "One unified context layer for your life. Capture anything. Find everything.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grid-bg" aria-hidden="true" />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
