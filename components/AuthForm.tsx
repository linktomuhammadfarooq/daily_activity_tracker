"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function AuthForm() {
  const { login, register, resetPassword } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Email and password are required.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setSaving(true);

      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password);
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(
        "Authentication failed. Check email/password or Firebase settings."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword() {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      alert("Enter your email first, then click reset password.");
      return;
    }

    try {
      setSaving(true);

      await resetPassword(cleanEmail);

      alert(`Password reset email sent. Check your inbox.${cleanEmail}`);
    } catch (error: any) {
      console.error("Reset password error:", error);

      if (error.code === "auth/user-not-found") {
        alert("No account exists with this email.");
        return;
      }

      if (error.code === "auth/invalid-email") {
        alert("Invalid email address.");
        return;
      }

      if (error.code === "auth/too-many-requests") {
        alert("Too many reset attempts. Wait a few minutes and try again.");
        return;
      }

      alert(`Password reset failed: ${error.code || "unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">
          {mode === "login" ? "Login" : "Create Account"}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Sign in to manage your private daily tasks.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {saving
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        {mode === "login" ? (
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={saving}
            className="mt-4 w-full text-sm font-semibold text-orange-600 hover:text-orange-700 disabled:text-orange-300"
          >
            Forgot password? Reset it
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 w-full text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          {mode === "login"
            ? "Need an account? Create one"
            : "Already have an account? Login"}
        </button>
      </section>
    </main>
  );
}
