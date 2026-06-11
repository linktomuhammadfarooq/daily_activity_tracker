"use client";

import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { ScheduleType } from "@/types/todo";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();

  const { user, authLoading } = useAuth();

  const taskId = params.taskId as string;

  const [title, setTitle] = useState("");
  const [scheduleType, setScheduleType] = useState<ScheduleType>("one_time");
  const [priority, setPriority] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTask() {
      if (!taskId || !user) return;

      try {
        const taskRef = doc(db, "tasks", taskId);
        const taskSnap = await getDoc(taskRef);

        if (!taskSnap.exists()) {
          alert("Task not found.");
          router.push("/");
          return;
        }

        const data = taskSnap.data();

        if (data.userId !== user.uid) {
          alert("You do not have permission to edit this task.");
          router.push("/");
          return;
        }

        setTitle(data.title || "");
        setScheduleType(data.scheduleType || "one_time");
        setPriority(Number(data.priority) || 1);
        setStartDate(data.startDate || "");
        setTaskDate(data.taskDate || data.startDate || "");
        setIsActive(data.isActive ?? true);
      } catch (error) {
        console.error("Failed to load task:", error);
        alert("Could not load task.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadTask();
    }
  }, [taskId, user, authLoading, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      alert("Task title is required.");
      return;
    }

    if (!startDate) {
      alert("Start date is required.");
      return;
    }

    if (scheduleType === "one_time" && !taskDate) {
      alert("Task date is required for one-time task.");
      return;
    }

    try {
      setSaving(true);

      await updateDoc(doc(db, "tasks", taskId), {
        title: cleanTitle,
        scheduleType,
        priority,
        startDate,
        taskDate: scheduleType === "one_time" ? taskDate : null,
        isActive,
        updatedAt: serverTimestamp(),
      });

      router.push("/");
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Task could not be updated.");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <section className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
          <p className="text-center text-slate-500">Checking login...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <section className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
          <p className="text-center text-slate-500">Loading task...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to tasks
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">Edit Task</h1>

          <p className="mt-2 text-sm text-slate-500">
            Editing task for {user.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Task Name
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task name"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Task Type
            </label>

            <select
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="one_time">One Time</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value={1}>Priority 1 - Low</option>
              <option value={2}>Priority 2</option>
              <option value={3}>Priority 3 - Medium</option>
              <option value={4}>Priority 4</option>
              <option value={5}>Priority 5 - High</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);

                if (scheduleType === "daily") {
                  setTaskDate(e.target.value);
                }
              }}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {scheduleType === "one_time" ? (
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                One-Time Task Date
              </label>

              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          ) : null}

          <label className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-5 w-5"
            />

            <span className="text-sm font-semibold text-slate-700">
              Active task
            </span>
          </label>

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <Link
              href="/"
              className="rounded-2xl bg-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
