"use client";

import { MeterUsageView } from "@/types/meter";
import { useEffect, useState } from "react";
import DesktopMeterTable from "./DesktopMeterTable";
import MobileMeterCards from "./MobileMeterCards";
import SummaryCards from "./SummaryCards";

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
