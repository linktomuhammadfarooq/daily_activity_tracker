"use client";

import { getMonthKey, isDateInMonth } from "@/lib/date";
import { db } from "@/lib/firebase";
import { Meter, MeterReading, MeterUsageView } from "@/types/meter";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export function useMeterUsage(selectedDate: string, userId?: string) {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [loadingMeters, setLoadingMeters] = useState(true);
  const [loadingReadings, setLoadingReadings] = useState(true);

  const selectedMonth = getMonthKey(selectedDate);

  useEffect(() => {
    if (!userId) {
      setMeters([]);
      setLoadingMeters(false);
      return;
    }

    setLoadingMeters(true);

    const metersRef = collection(db, "meters");
    const q = query(metersRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Meter[] = snapshot.docs.map((docItem) => {
          const data = docItem.data();

          return {
            id: docItem.id,
            userId: data.userId || "",
            name: data.name || "",
            openingReading: Number(data.openingReading) || 0,
            openingMonth: data.openingMonth || "",
            createdAt: data.createdAt?.toMillis?.() || 0,
          };
        });

        items.sort((a, b) => a.name.localeCompare(b.name));

        setMeters(items);
        setLoadingMeters(false);
      },
      (error) => {
        console.error("Meters Firestore error:", error);
        setLoadingMeters(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setReadings([]);
      setLoadingReadings(false);
      return;
    }

    setLoadingReadings(true);

    const readingsRef = collection(db, "meterReadings");
    const q = query(readingsRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: MeterReading[] = snapshot.docs.map((docItem) => {
          const data = docItem.data();

          return {
            id: docItem.id,
            userId: data.userId || "",
            meterId: data.meterId || "",
            date: data.date || "",
            readingValue: Number(data.readingValue) || 0,
            createdAt: data.createdAt?.toMillis?.() || 0,
            updatedAt: data.updatedAt?.toMillis?.() || 0,
          };
        });

        setReadings(items);
        setLoadingReadings(false);
      },
      (error) => {
        console.error("Meter readings Firestore error:", error);
        setLoadingReadings(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const usageRows = useMemo<MeterUsageView[]>(() => {
    return meters.map((meter) => {
      const meterReadings = readings
        .filter((reading) => reading.meterId === meter.id)
        .sort((a, b) => a.date.localeCompare(b.date));

      const todayReading =
        meterReadings.find((reading) => reading.date === selectedDate)
          ?.readingValue ?? null;

      const previousReadingBeforeToday = [...meterReadings]
        .filter((reading) => reading.date < selectedDate)
        .sort((a, b) => b.date.localeCompare(a.date))[0];

      const previousReading =
        previousReadingBeforeToday?.readingValue ?? meter.openingReading;

      const dailyUsage =
        todayReading === null ? 0 : Math.max(todayReading - previousReading, 0);

      const monthReadings = meterReadings
        .filter((reading) => isDateInMonth(reading.date, selectedMonth))
        .sort((a, b) => a.date.localeCompare(b.date));

      const latestMonthReading = monthReadings[monthReadings.length - 1];

      const currentMonthUsage = latestMonthReading
        ? Math.max(latestMonthReading.readingValue - meter.openingReading, 0)
        : 0;

      return {
        meterId: meter.id,
        meterName: meter.name,
        openingReading: meter.openingReading,
        todayReading,
        previousReading,
        dailyUsage,
        currentMonthUsage,
      };
    });
  }, [meters, readings, selectedDate, selectedMonth]);

  const totalDailyUsage = usageRows.reduce(
    (sum, row) => sum + row.dailyUsage,
    0
  );

  const totalCurrentMonthUsage = usageRows.reduce(
    (sum, row) => sum + row.currentMonthUsage,
    0
  );

  async function addMeter({
    name,
    openingReading,
  }: {
    name: string;
    openingReading: number;
  }) {
    if (!userId) {
      alert("You must be logged in to add meters.");
      return;
    }

    const cleanName = name.trim();

    if (!cleanName) return;

    await addDoc(collection(db, "meters"), {
      userId,
      name: cleanName,
      openingReading,
      openingMonth: selectedMonth,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function updateMeter({
    meterId,
    name,
    openingReading,
  }: {
    meterId: string;
    name: string;
    openingReading: number;
  }) {
    if (!userId) {
      alert("You must be logged in to update meters.");
      return;
    }

    await updateDoc(doc(db, "meters", meterId), {
      name: name.trim(),
      openingReading,
      updatedAt: serverTimestamp(),
    });
  }

  async function deleteMeter(meterId: string) {
    if (!userId) {
      alert("You must be logged in to delete meters.");
      return;
    }

    await deleteDoc(doc(db, "meters", meterId));
  }

  async function saveReading({
    meterId,
    date,
    readingValue,
  }: {
    meterId: string;
    date: string;
    readingValue: number;
  }) {
    if (!userId) {
      alert("You must be logged in to save readings.");
      return;
    }

    const readingId = `${userId}_${meterId}_${date}`;

    await setDoc(
      doc(db, "meterReadings", readingId),
      {
        userId,
        meterId,
        date,
        readingValue,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  return {
    meters,
    readings,
    usageRows,
    totalDailyUsage,
    totalCurrentMonthUsage,
    loading: loadingMeters || loadingReadings,
    addMeter,
    updateMeter,
    deleteMeter,
    saveReading,
  };
}
