"use client";

import { useState } from "react";

type MeterFormProps = {
  onAddMeter: (data: { name: string; openingReading: number }) => Promise<void>;
};

export default function MeterForm({ onAddMeter }: MeterFormProps) {
  const [name, setName] = useState("");
  const [openingReading, setOpeningReading] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanName = name.trim();
    const readingNumber = Number(openingReading);

    if (!cleanName) {
      alert("Meter name is required.");
      return;
    }

    if (Number.isNaN(readingNumber) || readingNumber < 0) {
      alert("Opening reading must be a valid number.");
      return;
    }

    try {
      setSaving(true);

      await onAddMeter({
        name: cleanName,
        openingReading: readingNumber,
      });

      setName("");
      setOpeningReading("");
    } catch (error) {
      console.error("Failed to add meter:", error);
      alert("Meter could not be added.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-3xl border border-purple-100 bg-purple-50/60 p-4"
    >
      <h3 className="mb-3 text-lg font-bold text-slate-950">Add Meter</h3>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_160px]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Meter name e.g. Main Meter"
          className="rounded-2xl border border-purple-200 bg-white px-4 py-3 outline-none focus:border-purple-500"
        />

        <input
          type="number"
          value={openingReading}
          onChange={(e) => setOpeningReading(e.target.value)}
          placeholder="Previous month reading"
          className="rounded-2xl border border-purple-200 bg-white px-4 py-3 outline-none focus:border-purple-500"
        />

        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-purple-600 px-5 py-3 font-semibold text-white shadow-md shadow-purple-200 hover:bg-purple-700 disabled:bg-purple-300"
        >
          {saving ? "Adding..." : "Add Meter"}
        </button>
      </div>
    </form>
  );
}
