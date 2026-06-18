import { getUnitColorClass } from "@/lib/helper";
export default function SummaryCards({
  totalDailyUsage,
  totalCurrentMonthUsage,
}: {
  totalDailyUsage: number;
  totalCurrentMonthUsage: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-3xl border border-violet-100 bg-white p-4 shadow-md shadow-purple-100">
        <p className="text-sm font-semibold text-slate-500">Total Daily Unit</p>

        <p className="mt-1 text-3xl font-bold text-violet-700">
          {totalDailyUsage}
        </p>
      </div>

      <div className="rounded-3xl border border-purple-100 bg-white p-4 shadow-md shadow-purple-100">
        <p className="text-sm font-semibold text-slate-500">
          Total Current Month Unit
        </p>

        <span
          className={`mt-2 inline-flex rounded-2xl px-4 py-2 text-2xl font-bold ring-1 ${getUnitColorClass(
            totalCurrentMonthUsage
          )}`}
        >
          {totalCurrentMonthUsage}
        </span>
      </div>
    </div>
  );
}
