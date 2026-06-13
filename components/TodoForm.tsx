"use client";

import { ScheduleType } from "@/types/todo";
import { useEffect, useState } from "react";

type TodoFormProps = {
  selectedDate: string;
  onAddTask: (data: {
    title: string;
    scheduleType: ScheduleType;
    taskDate: string;
    priority: number;
  }) => Promise<void>;
};

export default function TodoForm({ selectedDate, onAddTask }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [scheduleType, setScheduleType] = useState<ScheduleType>("one_time");
  const [taskDate, setTaskDate] = useState(selectedDate);
  const [priority, setPriority] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTaskDate(selectedDate);
  }, [selectedDate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setSaving(true);

      await onAddTask({
        title,
        scheduleType,
        taskDate,
        priority,
      });

      setTitle("");
      setScheduleType("one_time");
      setTaskDate(selectedDate);
      setPriority(1);
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("Task could not be added.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add task e.g. Walk 10000 steps"
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-purple-500"
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_160px_160px_1fr]">
        <select
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
          className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-purple-500"
        >
          <option value="one_time">One Time</option>
          <option value="daily">Daily</option>
        </select>

        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
          className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-purple-500"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-purple-500"
        >
          <option value={1}>Priority 1 - Low</option>
          <option value={2}>Priority 2</option>
          <option value={3}>Priority 3 - Medium</option>
          <option value={4}>Priority 4</option>
          <option value={5}>Priority 5 - High</option>
        </select>

        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-purple-600 px-5 py-3 font-semibold text-white shadow-md shadow-purple-200 hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
        >
          {saving ? "Adding..." : "Add Task"}
        </button>
      </div>

      <p className="text-sm text-slate-500">
        Higher priority tasks show first. Daily tasks appear every day from
        their start date. One-time tasks appear only on their selected date.
      </p>
    </form>
  );
}
