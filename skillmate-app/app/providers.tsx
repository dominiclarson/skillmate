"use client";

import React, {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import { findFirstSection } from "@/lib/skills";

interface AuthContextType {
  authenticated: boolean | null;
  activeSection: any;
  handleLogout: () => void;
  handleSectionChange: (sec: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function Providers({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(findFirstSection());
  const pathname = usePathname();
  const router = useRouter();

  // Check session on route change
  useEffect(() => {
    let alive = true;
    fetch("/api/auth/session")
      .then((res) => alive && setAuthenticated(res.ok))
      .catch(() => alive && setAuthenticated(false));
    return () => {
      alive = false;
    };
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (authenticated === null || !mounted) {
    return (
      <div className="flex items-center justify-center h-screen">Loading…</div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
    router.push("/login");
    toast.success("Logged out successfully");
  };

  const handleSectionChange = (sec: typeof activeSection) =>
    setActiveSection(sec);

  const authValue = {
    authenticated,
    activeSection,
    handleLogout,
    handleSectionChange,
  };

  return (
    <AuthContext.Provider value={authValue}>
      <ToastContainer position="bottom-right" />
      <ThemeProvider>
        <div>
          <Header
            authenticated={authenticated || false}
            onLogout={handleLogout}
          />
          {children}
        </div>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
