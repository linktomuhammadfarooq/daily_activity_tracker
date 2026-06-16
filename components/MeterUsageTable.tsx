"use client";

import { MeterUsageView } from "@/types/meter";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type MeterUsageTableProps = {
  selectedDate: string;
  usageRows: MeterUsageView[];
  totalDailyUsage: number;
  totalCurrentMonthUsage: number;
  loading: boolean;
  isSuperAdmin: boolean;
  currentUserId: string;
  onSaveReading: (data: {
    meterId: string;
    date: string;
    readingValue: number;
  }) => Promise<void>;
  onShareMeter: (data: { meterId: string; email: string }) => Promise<void>;
  onDeleteMeter: (meterId: string) => Promise<void>;
};

function getUnitColorClass(unit: number) {
  if (unit < 150) {
    return "bg-green-100 text-green-800 ring-green-200";
  }

  if (unit <= 185) {
    return "bg-yellow-100 text-yellow-800 ring-yellow-200";
  }

  return "bg-red-100 text-red-800 ring-red-200";
}

function canShareMeter({
  ownerId,
  currentUserId,
  isSuperAdmin,
}: {
  ownerId: string;
  currentUserId: string;
  isSuperAdmin: boolean;
}) {
  return isSuperAdmin || ownerId === currentUserId;
}

export default function MeterUsageTable({
  selectedDate,
  usageRows,
  totalDailyUsage,
  totalCurrentMonthUsage,
  loading,
  isSuperAdmin,
  currentUserId,
  onSaveReading,
  onShareMeter,
  onDeleteMeter,
}: MeterUsageTableProps) {
  const [readingInputs, setReadingInputs] = useState<Record<string, string>>(
    {}
  );

  const [shareEmails, setShareEmails] = useState<Record<string, string>>({});
  const [savingMeterId, setSavingMeterId] = useState<string | null>(null);
  const [sharingMeterId, setSharingMeterId] = useState<string | null>(null);
  const [deletingMeterId, setDeletingMeterId] = useState<string | null>(null);

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

    try {
      setSavingMeterId(meterId);

      await onSaveReading({
        meterId,
        date: selectedDate,
        readingValue,
      });
    } catch (error) {
      console.error("Failed to save reading:", error);
      alert("Reading could not be saved.");
    } finally {
      setSavingMeterId(null);
    }
  }

  async function handleShare(meterId: string) {
    const email = shareEmails[meterId]?.trim();

    if (!email) {
      alert("Enter user email first.");
      return;
    }

    try {
      setSharingMeterId(meterId);

      await onShareMeter({
        meterId,
        email,
      });

      setShareEmails((prev) => ({
        ...prev,
        [meterId]: "",
      }));
    } catch (error) {
      console.error("Failed to share meter:", error);
      alert("Meter could not be shared.");
    } finally {
      setSharingMeterId(null);
    }
  }

  async function handleDelete(meterId: string) {
    try {
      setDeletingMeterId(meterId);
      await onDeleteMeter(meterId);
    } catch (error) {
      console.error("Failed to delete meter:", error);
      alert("Meter could not be deleted.");
    } finally {
      setDeletingMeterId(null);
    }
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
    <div className="space-y-4">
      <SummaryCards
        totalDailyUsage={totalDailyUsage}
        totalCurrentMonthUsage={totalCurrentMonthUsage}
      />

      <MobileMeterCards
        selectedDate={selectedDate}
        usageRows={usageRows}
        readingInputs={readingInputs}
        setReadingInputs={setReadingInputs}
        shareEmails={shareEmails}
        setShareEmails={setShareEmails}
        savingMeterId={savingMeterId}
        sharingMeterId={sharingMeterId}
        deletingMeterId={deletingMeterId}
        isSuperAdmin={isSuperAdmin}
        currentUserId={currentUserId}
        onSave={handleSave}
        onShare={handleShare}
        onDelete={handleDelete}
      />

      <DesktopMeterTable
        usageRows={usageRows}
        readingInputs={readingInputs}
        setReadingInputs={setReadingInputs}
        shareEmails={shareEmails}
        setShareEmails={setShareEmails}
        savingMeterId={savingMeterId}
        sharingMeterId={sharingMeterId}
        deletingMeterId={deletingMeterId}
        isSuperAdmin={isSuperAdmin}
        currentUserId={currentUserId}
        totalDailyUsage={totalDailyUsage}
        totalCurrentMonthUsage={totalCurrentMonthUsage}
        onSave={handleSave}
        onShare={handleShare}
        onDelete={handleDelete}
      />
    </div>
  );
}

function SummaryCards({
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

function MobileMeterCards({
  selectedDate,
  usageRows,
  readingInputs,
  setReadingInputs,
  shareEmails,
  setShareEmails,
  savingMeterId,
  sharingMeterId,
  deletingMeterId,
  isSuperAdmin,
  currentUserId,
  onSave,
  onShare,
  onDelete,
}: {
  selectedDate: string;
  usageRows: MeterUsageView[];
  readingInputs: Record<string, string>;
  setReadingInputs: Dispatch<SetStateAction<Record<string, string>>>;
  shareEmails: Record<string, string>;
  setShareEmails: Dispatch<SetStateAction<Record<string, string>>>;
  savingMeterId: string | null;
  sharingMeterId: string | null;
  deletingMeterId: string | null;
  isSuperAdmin: boolean;
  currentUserId: string;
  onSave: (meterId: string) => Promise<void>;
  onShare: (meterId: string) => Promise<void>;
  onDelete: (meterId: string) => Promise<void>;
}) {
  return (
    <div className="space-y-4 md:hidden">
      {usageRows.map((row) => {
        const allowShare = canShareMeter({
          ownerId: row.ownerId,
          currentUserId,
          isSuperAdmin,
        });

        return (
          <article
            key={row.meterId}
            className="rounded-3xl border border-purple-100 bg-white p-4 shadow-lg shadow-purple-100"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-950">
                  {row.meterName}
                </h3>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Reading date: {selectedDate}
                </p>

                {row.ownerId === currentUserId ? (
                  <p className="mt-1 text-xs font-semibold text-purple-700">
                    Owner
                  </p>
                ) : (
                  <p className="mt-1 text-xs font-semibold text-violet-700">
                    Shared meter
                  </p>
                )}
              </div>

              <span
                className={`rounded-2xl px-3 py-1 text-xs font-bold ring-1 ${getUnitColorClass(
                  row.currentMonthUsage
                )}`}
              >
                Month: {row.currentMonthUsage}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoBox label="Previous" value={row.previousReading} />
              <InfoBox label="Daily Used" value={row.dailyUsage} />
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Today Reading
              </label>

              <input
                type="number"
                inputMode="decimal"
                value={readingInputs[row.meterId] ?? ""}
                onChange={(e) =>
                  setReadingInputs((prev) => ({
                    ...prev,
                    [row.meterId]: e.target.value,
                  }))
                }
                placeholder="Enter reading"
                className="w-full rounded-2xl border border-purple-200 bg-purple-50/40 px-4 py-3 text-base outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={() => onSave(row.meterId)}
              disabled={savingMeterId === row.meterId}
              className="mt-4 w-full rounded-2xl bg-purple-600 px-5 py-3 font-semibold text-white shadow-md shadow-purple-200 hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
            >
              {savingMeterId === row.meterId ? "Saving..." : "Save Reading"}
            </button>

            {allowShare ? (
              <div className="mt-4 rounded-2xl bg-purple-50 p-3">
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Share with user email
                </label>

                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    value={shareEmails[row.meterId] ?? ""}
                    onChange={(e) =>
                      setShareEmails((prev) => ({
                        ...prev,
                        [row.meterId]: e.target.value,
                      }))
                    }
                    placeholder="user@example.com"
                    className="w-full rounded-2xl border border-purple-200 bg-white px-3 py-2 outline-none focus:border-purple-500"
                  />

                  <button
                    type="button"
                    onClick={() => onShare(row.meterId)}
                    disabled={sharingMeterId === row.meterId}
                    className="rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
                  >
                    {sharingMeterId === row.meterId ? "Sharing..." : "Share"}
                  </button>
                </div>
              </div>
            ) : null}

            {isSuperAdmin ? (
              <button
                type="button"
                onClick={() => onDelete(row.meterId)}
                disabled={deletingMeterId === row.meterId}
                className="mt-3 w-full rounded-2xl bg-red-100 px-5 py-3 font-semibold text-red-700 hover:bg-red-200 disabled:cursor-not-allowed disabled:bg-red-50"
              >
                {deletingMeterId === row.meterId
                  ? "Deleting..."
                  : "Delete Meter"}
              </button>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-purple-50 p-3">
      <p className="text-xs font-semibold uppercase text-purple-700">{label}</p>

      <p className="mt-1 text-xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function DesktopMeterTable({
  usageRows,
  readingInputs,
  setReadingInputs,
  shareEmails,
  setShareEmails,
  savingMeterId,
  sharingMeterId,
  deletingMeterId,
  isSuperAdmin,
  currentUserId,
  totalDailyUsage,
  totalCurrentMonthUsage,
  onSave,
  onShare,
  onDelete,
}: {
  usageRows: MeterUsageView[];
  readingInputs: Record<string, string>;
  setReadingInputs: Dispatch<SetStateAction<Record<string, string>>>;
  shareEmails: Record<string, string>;
  setShareEmails: Dispatch<SetStateAction<Record<string, string>>>;
  savingMeterId: string | null;
  sharingMeterId: string | null;
  deletingMeterId: string | null;
  isSuperAdmin: boolean;
  currentUserId: string;
  totalDailyUsage: number;
  totalCurrentMonthUsage: number;
  onSave: (meterId: string) => Promise<void>;
  onShare: (meterId: string) => Promise<void>;
  onDelete: (meterId: string) => Promise<void>;
}) {
  return (
    <div className="hidden overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-xl shadow-purple-100 md:block">
      <table className="w-full border-collapse text-left">
        <thead className="bg-purple-50 text-sm uppercase text-purple-800">
          <tr>
            <th className="px-4 py-3">Meter</th>
            <th className="px-4 py-3">Previous</th>
            <th className="px-4 py-3">Today Reading</th>
            <th className="px-4 py-3">Daily Used</th>
            <th className="px-4 py-3">Month Unit</th>
            <th className="px-4 py-3">Save</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {usageRows.map((row) => {
            const allowShare = canShareMeter({
              ownerId: row.ownerId,
              currentUserId,
              isSuperAdmin,
            });

            return (
              <tr key={row.meterId} className="border-t border-purple-50">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">
                    {row.meterName}
                  </p>

                  {row.ownerId === currentUserId ? (
                    <p className="mt-1 text-xs font-semibold text-purple-700">
                      Owner
                    </p>
                  ) : (
                    <p className="mt-1 text-xs font-semibold text-violet-700">
                      Shared
                    </p>
                  )}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {row.previousReading}
                </td>

                <td className="px-4 py-4">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={readingInputs[row.meterId] ?? ""}
                    onChange={(e) =>
                      setReadingInputs((prev) => ({
                        ...prev,
                        [row.meterId]: e.target.value,
                      }))
                    }
                    placeholder="Enter reading"
                    className="w-36 rounded-2xl border border-purple-200 bg-purple-50/40 px-3 py-2 outline-none focus:border-purple-500 focus:bg-white"
                  />
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-2xl bg-violet-100 px-3 py-1 text-sm font-bold text-violet-800">
                    {row.dailyUsage}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-2xl px-3 py-1 text-sm font-bold ring-1 ${getUnitColorClass(
                      row.currentMonthUsage
                    )}`}
                  >
                    {row.currentMonthUsage}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => onSave(row.meterId)}
                    disabled={savingMeterId === row.meterId}
                    className="rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                  >
                    {savingMeterId === row.meterId ? "Saving..." : "Save"}
                  </button>
                </td>

                <td className="px-4 py-4">
                  <div className="space-y-2">
                    {allowShare ? (
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={shareEmails[row.meterId] ?? ""}
                          onChange={(e) =>
                            setShareEmails((prev) => ({
                              ...prev,
                              [row.meterId]: e.target.value,
                            }))
                          }
                          placeholder="Share email"
                          className="w-40 rounded-2xl border border-purple-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500"
                        />

                        <button
                          type="button"
                          onClick={() => onShare(row.meterId)}
                          disabled={sharingMeterId === row.meterId}
                          className="rounded-2xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
                        >
                          {sharingMeterId === row.meterId
                            ? "Sharing..."
                            : "Share"}
                        </button>
                      </div>
                    ) : null}

                    {isSuperAdmin ? (
                      <button
                        type="button"
                        onClick={() => onDelete(row.meterId)}
                        disabled={deletingMeterId === row.meterId}
                        className="rounded-2xl bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 disabled:cursor-not-allowed disabled:bg-red-50"
                      >
                        {deletingMeterId === row.meterId
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}

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
              <span
                className={`rounded-2xl px-3 py-1 text-sm font-bold ring-1 ${getUnitColorClass(
                  totalCurrentMonthUsage
                )}`}
              >
                {totalCurrentMonthUsage}
              </span>
            </td>

            <td className="px-4 py-4"></td>
            <td className="px-4 py-4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
