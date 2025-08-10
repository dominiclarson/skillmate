import "./globals.css";
import Providers from "./providers";
import { ReactNode } from "react";


export const metadata = {
  title: "SkillMate",
  description: "Swap skills and manage your account",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
