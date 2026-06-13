"use client";

import AuthForm from "@/components/AuthForm";
import MeterForm from "@/components/MeterForm";
import MeterUsageTable from "@/components/MeterUsageTable";
import { useAuth } from "@/hooks/useAuth";
import { useMeterUsage } from "@/hooks/useMeterUsage";
import { getTodayDate } from "@/lib/date";
import { useState } from "react";

export default function UsagePage() {
  const today = getTodayDate();

  const [selectedDate, setSelectedDate] = useState(today);

  const { user, authLoading } = useAuth();

  const {
    usageRows,
    totalDailyUsage,
    totalCurrentMonthUsage,
    loading,
    addMeter,
    saveReading,
  } = useMeterUsage(selectedDate, user?.uid);

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
    <section className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <div className="mb-6 rounded-3xl border border-purple-100 bg-white p-5 shadow-xl shadow-purple-100/70 md:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Daily Unit Usage
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add one or more meters, enter daily readings, and calculate daily
              plus current-month unit consumption automatically.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Reading Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-2xl border border-purple-200 bg-purple-50/50 px-4 py-3 font-medium text-slate-800 outline-none focus:border-purple-500 focus:bg-white md:w-auto"
            />
          </div>
        </div>

        <MeterForm onAddMeter={addMeter} />

        <MeterUsageTable
          selectedDate={selectedDate}
          usageRows={usageRows}
          totalDailyUsage={totalDailyUsage}
          totalCurrentMonthUsage={totalCurrentMonthUsage}
          loading={loading}
          onSaveReading={saveReading}
        />
      </div>
    </section>
  );
}
