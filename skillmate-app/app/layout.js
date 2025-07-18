import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "SkillMate",
  description: "Swap skills",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            {/* Header: moved to app/page.js */}
            {/* Main Content */}
            <main className="flex-grow">{children}</main>
            {/* Footer: moved to app/page.js */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
