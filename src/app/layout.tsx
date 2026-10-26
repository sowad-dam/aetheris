import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AETHERIS | Autonomous Digital Infrastructure",
  description:
    "Executive AI & Autonomous Orchestration Studio. Architecting self-correcting agentic workflows and real-time enterprise pipelines.",
  keywords: [
    "Aetheris",
    "Autonomous Infrastructure",
    "Agentic Workflows",
    "Enterprise AI",
    "Neural Mesh",
    "Design Engineering",
  ],
  authors: [{ name: "Aetheris Systems Core" }],
  openGraph: {
    title: "AETHERIS | Autonomous Digital Infrastructure",
    description:
      "Autonomous digital infrastructure & intelligent enterprise workflows.",
    siteName: "AETHERIS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-[#050508] text-white overflow-hidden selection:bg-[#ff0055] selection:text-white">
        {children}
      </body>
    </html>
  );
}
