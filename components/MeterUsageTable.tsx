"use client";

import { MeterUsageView } from "@/types/meter";
import { useEffect, useState } from "react";

type MeterUsageTableProps = {
  selectedDate: string;
  usageRows: MeterUsageView[];
  totalDailyUsage: number;
  totalCurrentMonthUsage: number;
  loading: boolean;
  onSaveReading: (data: {
    meterId: string;
    date: string;
    readingValue: number;
  }) => Promise<void>;
};

export default function MeterUsageTable({
  selectedDate,
  usageRows,
  totalDailyUsage,
  totalCurrentMonthUsage,
  loading,
  onSaveReading,
}: MeterUsageTableProps) {
  const [readingInputs, setReadingInputs] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const nextInputs: Record<string, string> = {};

    usageRows.forEach((row) => {
      nextInputs[row.meterId] =
        row.todayReading === null ? "" : String(row.todayReading);
    });

    setReadingInputs(nextInputs);
  }, [usageRows]);

  async function handleSave(meterId: string) {
    const rawValue = readingInputs[meterId];
    const readingValue = Number(rawValue);

    if (rawValue === "" || Number.isNaN(readingValue) || readingValue < 0) {
      alert("Enter a valid meter reading.");
      return;
    }

    await onSaveReading({
      meterId,
      date: selectedDate,
      readingValue,
    });
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center text-slate-500 shadow-xl shadow-purple-100">
        Loading meter usage...
      </div>
    );
  }

  if (usageRows.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-purple-200 bg-white p-8 text-center shadow-xl shadow-purple-100">
        <p className="font-semibold text-slate-800">No meters found.</p>
        <p className="mt-1 text-sm text-slate-500">
          Add your first meter above to start tracking daily unit usage.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-xl shadow-purple-100">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-purple-50 text-sm uppercase text-purple-800">
            <tr>
              <th className="px-4 py-3">Meter</th>
              <th className="px-4 py-3">Previous Reading</th>
              <th className="px-4 py-3">Today Reading</th>
              <th className="px-4 py-3">Daily Unit Used</th>
              <th className="px-4 py-3">Current Month Unit</th>
              <th className="px-4 py-3">Save</th>
            </tr>
          </thead>

          <tbody>
            {usageRows.map((row) => (
              <tr key={row.meterId} className="border-t border-purple-50">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">
                    {row.meterName}
                  </p>
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {row.previousReading}
                </td>

                <td className="px-4 py-4">
                  <input
                    type="number"
                    value={readingInputs[row.meterId] ?? ""}
                    onChange={(e) =>
                      setReadingInputs((prev) => ({
                        ...prev,
                        [row.meterId]: e.target.value,
                      }))
                    }
                    placeholder="Enter reading"
                    className="w-40 rounded-2xl border border-purple-200 bg-purple-50/40 px-3 py-2 outline-none focus:border-purple-500 focus:bg-white"
                  />
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-2xl bg-violet-100 px-3 py-1 text-sm font-bold text-violet-800">
                    {row.dailyUsage}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-2xl bg-purple-100 px-3 py-1 text-sm font-bold text-purple-800">
                    {row.currentMonthUsage}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => handleSave(row.meterId)}
                    className="rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}

            <tr className="border-t-2 border-purple-200 bg-purple-50">
              <td className="px-4 py-4 font-bold text-slate-950">Total</td>
              <td className="px-4 py-4"></td>
              <td className="px-4 py-4"></td>
              <td className="px-4 py-4">
                <span className="rounded-2xl bg-violet-600 px-3 py-1 text-sm font-bold text-white">
                  {totalDailyUsage}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="rounded-2xl bg-purple-600 px-3 py-1 text-sm font-bold text-white">
                  {totalCurrentMonthUsage}
                </span>
              </td>
              <td className="px-4 py-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
