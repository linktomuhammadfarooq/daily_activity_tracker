"use client";
import { useAuthMode } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function AuthForm() {
  const { login, register, resetPassword } = useAuth();

  const { authMode: mode, setAuthMode: setMode } = useAuthMode();
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

      alert("Password reset email sent. Check inbox and spam folder.");
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
    <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-10 px-4 py-8 md:grid-cols-[1.1fr_0.9fr] md:py-14">
      <div className="hidden md:block">
        <p className="mb-4 inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
          Private daily productivity system
        </p>

        <h2 className="max-w-2xl text-5xl font-bold tracking-tight text-slate-950">
          Stay focused on what matters today.
        </h2>

        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
          Track daily tasks, one-time tasks, priority, partial progress, and
          completion history from one clean dashboard.
        </p>

        <div className="mt-8 space-y-4">
          <Feature text="Daily tasks repeat automatically from their start date" />
          <Feature text="One-time tasks appear only on the selected day" />
          <Feature text="Done tasks move to the end so unfinished work stays visible" />
          <Feature text="Partial progress lets you record real effort, not fake completion" />
        </div>
      </div>

      <section className="w-full rounded-3xl border border-purple-100 bg-white p-6 shadow-xl shadow-purple-100 md:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {mode === "login"
              ? "Login to continue managing your private tasks."
              : "Create an account to start tracking your daily progress."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-purple-200 bg-purple-50/40 px-4 py-3 outline-none focus:border-purple-500 focus:bg-white"
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
              className="w-full rounded-2xl border border-purple-200 bg-purple-50/40 px-4 py-3 outline-none focus:border-purple-500 focus:bg-white"
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-purple-600 px-5 py-3 font-semibold text-white shadow-md shadow-purple-200 hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
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
          className="mt-4 w-full text-sm font-semibold text-purple-600 hover:text-purple-700"
        >
          {mode === "login"
            ? "Need an account? Create one"
            : "Already have an account? Login"}
        </button>
      </section>
    </section>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-700">
        <CheckCircle2 className="h-4 w-4" />
      </div>

      <p className="text-sm font-medium text-slate-700">{text}</p>
    </div>
  );
}
