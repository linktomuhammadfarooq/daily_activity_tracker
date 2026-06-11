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

  const { user, authLoading, logout } = useAuth();

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
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <section className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-xl">
          <p className="text-center text-slate-500">Checking login...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Daily Task Tracker
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Signed in as{" "}
              <span className="font-semibold text-slate-700">{user.email}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-600">
                View Date
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-2xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
            >
              Logout
            </button>
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
      </section>
    </main>
  );
}
