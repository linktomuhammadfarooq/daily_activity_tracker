"use client";

import { getMonthKey, isDateInMonth } from "@/lib/date";
import { db } from "@/lib/firebase";
import { Meter, MeterReading, MeterUsageView } from "@/types/meter";
import { UserRole } from "@/types/user";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export function useMeterUsage(
  selectedDate: string,
  userId?: string,
  role: UserRole = "user"
) {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [loadingMeters, setLoadingMeters] = useState(true);
  const [loadingReadings, setLoadingReadings] = useState(true);

  const selectedMonth = getMonthKey(selectedDate);
  const isSuperAdmin = role === "super_admin";

  useEffect(() => {
    if (!userId) {
      setMeters([]);
      setLoadingMeters(false);
      return;
    }

    setLoadingMeters(true);

    const metersRef = collection(db, "meters");

    // Super admin can see all meters.
    if (isSuperAdmin) {
      const unsubscribe = onSnapshot(
        metersRef,
        (snapshot) => {
          const items = snapshot.docs.map(parseMeter);
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
    }

    // Normal users need owned meters + shared meters.
    let ownedMeters: Meter[] = [];
    let sharedMeters: Meter[] = [];

    const ownedQuery = query(metersRef, where("ownerId", "==", userId));

    const sharedQuery = query(
      metersRef,
      where("sharedWithUserIds", "array-contains", userId)
    );

    const unsubscribeOwned = onSnapshot(
      ownedQuery,
      (snapshot) => {
        ownedMeters = snapshot.docs.map(parseMeter);
        setMeters(mergeMeters(ownedMeters, sharedMeters));
        setLoadingMeters(false);
      },
      (error) => {
        console.error("Owned meters error:", error);
        setLoadingMeters(false);
      }
    );

    const unsubscribeShared = onSnapshot(
      sharedQuery,
      (snapshot) => {
        sharedMeters = snapshot.docs.map(parseMeter);
        setMeters(mergeMeters(ownedMeters, sharedMeters));
        setLoadingMeters(false);
      },
      (error) => {
        console.error("Shared meters error:", error);
        setLoadingMeters(false);
      }
    );

    return () => {
      unsubscribeOwned();
      unsubscribeShared();
    };
  }, [userId, isSuperAdmin]);

  useEffect(() => {
    if (!userId) {
      setReadings([]);
      setLoadingReadings(false);
      return;
    }

    setLoadingReadings(true);

    // Avoid reading readings before meters are loaded.
    if (!isSuperAdmin && meters.length === 0) {
      setReadings([]);
      setLoadingReadings(false);
      return;
    }

    const readingsRef = collection(db, "meterReadings");

    // Super admin reads all readings.
    if (isSuperAdmin) {
      const unsubscribe = onSnapshot(
        readingsRef,
        (snapshot) => {
          setReadings(snapshot.docs.map(parseReading));
          setLoadingReadings(false);
        },
        (error) => {
          console.error("Meter readings error:", error);
          setLoadingReadings(false);
        }
      );

      return () => unsubscribe();
    }

    // Normal user reads readings for accessible meters.
    const unsubscribers: Array<() => void> = [];
    const readingsByMeter = new Map<string, MeterReading[]>();

    meters.forEach((meter) => {
      const q = query(readingsRef, where("meterId", "==", meter.id));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          readingsByMeter.set(meter.id, snapshot.docs.map(parseReading));

          const mergedReadings = Array.from(readingsByMeter.values()).flat();

          setReadings(mergedReadings);
          setLoadingReadings(false);
        },
        (error) => {
          console.error("Meter readings by meter error:", error);
          setLoadingReadings(false);
        }
      );

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [userId, meters, isSuperAdmin]);

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
        ownerId: meter.ownerId,
        sharedWithUserIds: meter.sharedWithUserIds,
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
      ownerId: userId,
      sharedWithUserIds: [],
      name: cleanName,
      openingReading,
      openingMonth: selectedMonth,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
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

    const meter = meters.find((item) => item.id === meterId);

    if (!meter && !isSuperAdmin) {
      alert("You do not have access to this meter.");
      return;
    }

    const readingId = `${meterId}_${date}`;

    await setDoc(
      doc(db, "meterReadings", readingId),
      {
        ownerId: meter?.ownerId || userId,
        meterId,
        date,
        readingValue,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  async function shareMeterWithEmail({
    meterId,
    email,
  }: {
    meterId: string;
    email: string;
  }) {
    if (!userId) {
      alert("You must be logged in to share meters.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Email is required.");
      return;
    }

    const meter = meters.find((item) => item.id === meterId);

    if (!meter) {
      alert("Meter not found.");
      return;
    }

    if (!isSuperAdmin && meter.ownerId !== userId) {
      alert("Only the meter owner or super admin can share this meter.");
      return;
    }

    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", cleanEmail)
    );

    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      alert(
        "No user found with this email. The user must create an account first."
      );
      return;
    }

    const targetUserDoc = usersSnapshot.docs[0];
    const targetUserId = targetUserDoc.id;

    if (targetUserId === meter.ownerId) {
      alert("This user already owns the meter.");
      return;
    }

    await updateDoc(doc(db, "meters", meterId), {
      sharedWithUserIds: arrayUnion(targetUserId),
      updatedAt: serverTimestamp(),
    });

    alert("Meter shared successfully.");
  }

  async function deleteMeter(meterId: string) {
    if (!userId) {
      alert("You must be logged in to delete meters.");
      return;
    }

    if (!isSuperAdmin) {
      alert("Only super admin can delete meters.");
      return;
    }

    const confirmDelete = confirm(
      "Delete this meter? Existing readings will remain unless you delete them separately."
    );

    if (!confirmDelete) return;

    await deleteDoc(doc(db, "meters", meterId));
  }

  return {
    meters,
    readings,
    usageRows,
    totalDailyUsage,
    totalCurrentMonthUsage,
    loading: loadingMeters || loadingReadings,
    addMeter,
    saveReading,
    shareMeterWithEmail,
    deleteMeter,
    isSuperAdmin,
  };
}

function parseMeter(docItem: any): Meter {
  const data = docItem.data();

  return {
    id: docItem.id,
    ownerId: data.ownerId || data.userId || "",
    sharedWithUserIds: data.sharedWithUserIds || [],
    name: data.name || "",
    openingReading: Number(data.openingReading) || 0,
    openingMonth: data.openingMonth || "",
    createdAt: data.createdAt?.toMillis?.() || 0,
  };
}

function parseReading(docItem: any): MeterReading {
  const data = docItem.data();

  return {
    id: docItem.id,
    ownerId: data.ownerId || data.userId || "",
    meterId: data.meterId || "",
    date: data.date || "",
    readingValue: Number(data.readingValue) || 0,
    createdAt: data.createdAt?.toMillis?.() || 0,
    updatedAt: data.updatedAt?.toMillis?.() || 0,
  };
}

function mergeMeters(first: Meter[], second: Meter[]) {
  const map = new Map<string, Meter>();

  [...first, ...second].forEach((meter) => {
    map.set(meter.id, meter);
  });

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}
