"use client";

import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/hooks/useAuth";
import { createContext, ReactNode, useContext, useState } from "react";

type AuthMode = "login" | "register";

type AuthModeContextValue = {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
};

const AuthModeContext = createContext<AuthModeContextValue | null>(null);

export function useAuthMode() {
  const context = useContext(AuthModeContext);

  if (!context) {
    throw new Error("useAuthMode must be used inside AppShell");
  }

  return context;
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  return (
    <AuthModeContext.Provider value={{ authMode, setAuthMode }}>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <AppHeader
          variant={user ? "private" : "public"}
          email={user?.email}
          onLogout={user ? logout : undefined}
          authMode={authMode}
          onAuthModeChange={setAuthMode}
        />

        {children}
      </main>
    </AuthModeContext.Provider>
  );
}
