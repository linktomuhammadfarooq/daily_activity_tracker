"use client";

import AuthForm from "@/components/AuthForm";
import FilterTabs from "@/components/FilterTabs";
import StatsCards from "@/components/StatsCards";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import { useAuth } from "@/hooks/useAuth";
import { useTodos } from "@/hooks/useTodos";
import { getTodayDate } from "@/lib/date";
import { FilterType } from "@/types/todo";
import { useMemo, useState } from "react";

export default function Home() {
  const today = getTodayDate();

  const [selectedDate, setSelectedDate] = useState(today);
  const [filter, setFilter] = useState<FilterType>("all");

  const { user, authLoading } = useAuth();

  const {
    todos,
    loading,
    addTask,
    updateTaskStatus,
    updatePartialText,
    deleteTask,
  } = useTodos(selectedDate, user?.uid);

  const filteredTodos = useMemo(() => {
    if (filter === "all") return todos;
    return todos.filter((todo) => todo.status === filter);
  }, [todos, filter]);

  if (authLoading) {
    return (
      <section className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-xl shadow-purple-100">
          <p className="text-center text-slate-500">Checking login...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      <section className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <div className="mb-6 rounded-3xl border border-purple-100 bg-white p-5 shadow-xl shadow-purple-100/70 md:p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Today&apos;s Focus
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Not-done tasks appear first, then partial tasks, and completed
                tasks move to the end.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                View Date
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-2xl border border-purple-200 bg-purple-50/50 px-4 py-3 font-medium text-slate-800 outline-none focus:border-purple-500 focus:bg-white md:w-auto"
              />
            </div>
          </div>

          <StatsCards todos={todos} />

          <TodoForm selectedDate={selectedDate} onAddTask={addTask} />

          <FilterTabs filter={filter} setFilter={setFilter} />

          <TodoList
            todos={filteredTodos}
            loading={loading}
            onUpdateStatus={updateTaskStatus}
            onUpdatePartialText={updatePartialText}
            onDeleteTask={deleteTask}
          />
        </div>
      </section>
    </main>
  );
}
