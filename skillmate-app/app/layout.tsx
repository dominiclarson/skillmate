import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "SkillMate",
  description: "Swap skills and manage your account",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
