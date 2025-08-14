import type { Metadata } from "next";
import "../../styles/globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "AI Dashboard",
  description: "AI-powered widgets with drag-and-drop",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-dvh bg-background text-foreground antialiased")}>
        {children}
      </body>
    </html>
  );
}
