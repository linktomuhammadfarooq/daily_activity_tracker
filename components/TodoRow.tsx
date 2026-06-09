"use client";

import { TodoStatus, TodoView } from "@/types/todo";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type TodoRowProps = {
  todo: TodoView;
  onUpdateStatus: (data: {
    taskId: string;
    date: string;
    status: TodoStatus;
    partialText?: string;
  }) => Promise<void>;
  onUpdatePartialText: (data: {
    taskId: string;
    date: string;
    partialText: string;
  }) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
};

export default function TodoRow({
  todo,
  onUpdateStatus,
  onUpdatePartialText,
  onDeleteTask,
}: TodoRowProps) {
  const [partialText, setPartialText] = useState(todo.partialText || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPartialText(todo.partialText || "");
  }, [todo.partialText]);

  async function handleStatusChange(status: TodoStatus) {
    try {
      setSaving(true);

      await onUpdateStatus({
        taskId: todo.taskId,
        date: todo.date,
        status,
        partialText,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Status could not be updated.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePartialSave() {
    const cleanPartialText = partialText.trim();

    if (!cleanPartialText) return;

    try {
      setSaving(true);

      await onUpdatePartialText({
        taskId: todo.taskId,
        date: todo.date,
        partialText: cleanPartialText,
      });
    } catch (error) {
      console.error("Failed to update partial progress:", error);
      alert("Partial progress could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmDelete = confirm(
      "Delete this task? This removes the task from future days too."
    );

    if (!confirmDelete) return;

    try {
      await onDeleteTask(todo.taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Task could not be deleted.");
    }
  }

  return (
    <li className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_110px_130px_1.4fr_120px] md:items-center">
      <div>
        <p
          className={
            todo.status === "done"
              ? "font-medium text-slate-400 line-through"
              : "font-medium text-slate-900"
          }
        >
          {todo.title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Priority {todo.priority} |{" "}
          {todo.scheduleType === "daily"
            ? `Daily task | Started: ${todo.startDate}`
            : `One-time task | Date: ${todo.taskDate}`}
        </p>

        {todo.status === "partial_done" && todo.partialText ? (
          <p className="mt-1 text-xs font-semibold text-yellow-700">
            Partial: {todo.partialText}
          </p>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-green-700">
        <input
          type="checkbox"
          checked={todo.status === "done"}
          disabled={saving}
          onChange={() => handleStatusChange("done")}
          className="h-5 w-5"
        />
        Done
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-orange-700">
        <input
          type="checkbox"
          checked={todo.status === "not_done"}
          disabled={saving}
          onChange={() => handleStatusChange("not_done")}
          className="h-5 w-5"
        />
        Not Done
      </label>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={todo.status === "partial_done"}
          disabled={saving}
          onChange={() => handleStatusChange("partial_done")}
          className="h-5 w-5"
        />

        <input
          value={partialText}
          onChange={(e) => setPartialText(e.target.value)}
          onBlur={handlePartialSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          placeholder="e.g. 6000 steps completed"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/tasks/${todo.taskId}/edit`}
          className="rounded-xl bg-blue-100 px-2 py-2 text-sm font-semibold text-blue-700 hover:text-blue-200"
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          className="rounded-xl bg-red-100 p-2 text-red-600 hover:bg-red-200"
          aria-label="Delete task"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
}
