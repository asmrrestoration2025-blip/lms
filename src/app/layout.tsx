import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lumen LMS — Learn Without Limits",
    template: "%s | Lumen LMS",
  },
  description:
    "A global learning marketplace for students and instructors — courses, progress tracking, certificates, and more.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
