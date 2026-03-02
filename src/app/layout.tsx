import type { Metadata } from "next";
import ThemeRegistry from "@/components/ThemeRegistry";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTube Song Searcher for IRIAM",
  description: "Search songs from allowed YouTube channels for IRIAM singing streams.",
};

/**
 * Root Layout Component.
 * Acts as the entry point for the application's HTML structure.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Inner content to be wrapped by the layout and providers.
 * @returns {React.JSX.Element} The absolute root of the application hierarchy.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="ja">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
