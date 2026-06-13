"use client";

import { CheckSquare, LogOut, UserCircle2 } from "lucide-react";
import Link from "next/link";
type AppHeaderProps = {
  email?: string | null;
  onLogout?: () => void;
  variant?: "public" | "private";
  authMode?: "login" | "register";
  onAuthModeChange?: (mode: "login" | "register") => void;
};

function getUserNameFromEmail(email?: string | null) {
  if (!email) return "User";

  const namePart = email.split("@")[0];

  return namePart
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AppHeader({
  email,
  onLogout,
  variant = "private",
  authMode = "login",
  onAuthModeChange,
}: AppHeaderProps) {
  const userName = getUserNameFromEmail(email);
  const isPrivate = variant === "private";

  return (
    <header className="sticky top-0 z-30 border-b border-purple-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-200">
            <CheckSquare className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-950 md:text-2xl">
              Daily Task Tracker
            </h1>

            <p className="hidden text-sm text-slate-500 sm:block">
              Plan, track, and review your daily progress
            </p>
          </div>
        </div>

        {isPrivate ? (
          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/"
              className="rounded-2xl px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50"
            >
              Tasks
            </Link>

            <Link
              href="/usage"
              className="rounded-2xl px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50"
            >
              Unit Usage
            </Link>
          </nav>
        ) : null}

        {isPrivate ? (
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 rounded-2xl bg-purple-50 px-4 py-2 md:flex">
              <UserCircle2 className="h-8 w-8 text-purple-700" />

              <div className="max-w-[220px]">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {userName}
                </p>

                <p className="truncate text-xs text-slate-500">{email}</p>
              </div>
            </div>

            {onLogout ? (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 hover:bg-violet-700"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              onAuthModeChange?.(authMode === "login" ? "register" : "login")
            }
            className="rounded-2xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-200 hover:bg-purple-700"
          >
            {authMode === "login" ? "Create Account" : "Login"}
          </button>
        )}
      </div>

      {isPrivate ? (
        <div className="border-t border-purple-50 px-4 py-2 md:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-2 text-sm">
            <UserCircle2 className="h-5 w-5 text-purple-700" />

            <span className="font-semibold text-slate-800">{userName}</span>

            <span className="truncate text-slate-500">{email}</span>
          </div>

          <nav className="mx-auto mt-2 flex max-w-6xl gap-2">
            <Link
              href="/"
              className="flex-1 rounded-2xl bg-purple-50 px-4 py-2 text-center text-sm font-semibold text-purple-700"
            >
              Tasks
            </Link>

            <Link
              href="/usage"
              className="flex-1 rounded-2xl bg-purple-50 px-4 py-2 text-center text-sm font-semibold text-purple-700"
            >
              Unit Usage
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
