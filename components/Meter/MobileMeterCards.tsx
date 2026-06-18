import { canShareMeter, getUnitColorClass } from "@/lib/helper";
import { MeterUsageView } from "@/types/meter";
import { Loader, Share2, Trash2, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import InfoBox from "./InfoBox";

export default function MobileMeterCards({
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
  const [activeShareMeter, setActiveShareMeter] =
    useState<MeterUsageView | null>(null);

  function openShareModal(row: MeterUsageView) {
    setActiveShareMeter(row);
  }

  function closeShareModal() {
    setActiveShareMeter(null);
  }

  async function handleShareFromModal() {
    if (!activeShareMeter) return;

    await onShare(activeShareMeter.meterId);

    setActiveShareMeter(null);
  }

  return (
    <>
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
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-slate-950">
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

                <div className="flex shrink-0 items-start gap-2">
                  <span
                    className={`rounded-2xl px-3 py-1 text-xs font-bold ring-1 ${getUnitColorClass(
                      row.currentMonthUsage
                    )}`}
                  >
                    Month: {row.currentMonthUsage}
                  </span>

                  {allowShare ? (
                    <button
                      type="button"
                      onClick={() => openShareModal(row)}
                      disabled={sharingMeterId === row.meterId}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:cursor-not-allowed disabled:bg-violet-50"
                      title="Share meter"
                    >
                      {sharingMeterId === row.meterId ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                    </button>
                  ) : null}

                  {isSuperAdmin ? (
                    <button
                      type="button"
                      onClick={() => onDelete(row.meterId)}
                      disabled={deletingMeterId === row.meterId}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-red-100 text-red-700 hover:bg-red-200 disabled:cursor-not-allowed disabled:bg-red-50"
                      title="Delete meter"
                    >
                      {deletingMeterId === row.meterId ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  ) : null}
                </div>
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
                  className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
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
            </article>
          );
        })}
      </div>

      {activeShareMeter ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 md:hidden">
          <div className="w-full max-w-sm rounded-3xl border border-purple-100 bg-white p-5 shadow-2xl shadow-slate-900/20">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-950">
                  Share Meter
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Share{" "}
                  <span className="font-semibold text-purple-700">
                    {activeShareMeter.meterName}
                  </span>{" "}
                  with another registered user.
                </p>
              </div>

              <button
                type="button"
                onClick={closeShareModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mb-1 block text-sm font-semibold text-slate-700">
              User Email
            </label>

            <input
              type="email"
              value={shareEmails[activeShareMeter.meterId] ?? ""}
              onChange={(e) =>
                setShareEmails((prev) => ({
                  ...prev,
                  [activeShareMeter.meterId]: e.target.value,
                }))
              }
              placeholder="user@example.com"
              className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              autoFocus
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={closeShareModal}
                className="flex-1 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleShareFromModal}
                disabled={sharingMeterId === activeShareMeter.meterId}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
              >
                {sharingMeterId === activeShareMeter.meterId ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Share
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
