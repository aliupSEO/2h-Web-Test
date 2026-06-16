import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getDesignSystemSettings, getDesignSystemCSS } from "@/lib/design-system";
import "./globals.css";

/**
 * AGENT RULES:
 * - Do NOT add "use client" to this file — it breaks streaming and metadata.
 * - Font is Inter — do not import other fonts here without also updating globals.css.
 * - Update the metadata defaults below for each new project.
 * - Design system CSS is fetched from WordPress and injected as a <style> tag.
 *   If the Design System Settings plugin is not installed, the hardcoded defaults
 *   in globals.css are used instead.
 */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // ── Edit these per project ──────────────────────────────────────────────
  title: {
    default: "Your Site Name",
    template: "%s | Your Site Name",
  },
  description: "Your site description — edit this in app/layout.tsx",
  // ── Keep these ─────────────────────────────────────────────────────────
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Fetch design system tokens from WordPress (cached 60s)
  // Falls back to globals.css defaults if plugin not installed
  const dsSettings = await getDesignSystemSettings();
  const dsCSS = dsSettings ? getDesignSystemCSS(dsSettings) : "";

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        {dsCSS && (
          <style
            id="design-system-tokens"
            dangerouslySetInnerHTML={{ __html: dsCSS }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

