"use client";
// Temporary migration button to assign all existing tasks and task history to a single user account. Run once, then remove this component from the code.
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { useState } from "react";

const TARGET_USER_ID = "71tcL1lXyCf29O7fmj49e2pgQ0s2";

type MigrationButtonProps = {
  currentUserId: string;
};

export default function MigrationButton({
  currentUserId,
}: MigrationButtonProps) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  async function updateCollectionUserId(
    collectionName: "tasks" | "taskHistory"
  ) {
    const snapshot = await getDocs(collection(db, collectionName));

    let batch = writeBatch(db);
    let operationCount = 0;
    let updatedCount = 0;

    for (const docSnapshot of snapshot.docs) {
      batch.update(docSnapshot.ref, {
        userId: TARGET_USER_ID,
        updatedAt: serverTimestamp(),
      });

      operationCount += 1;
      updatedCount += 1;

      if (operationCount === 450) {
        await batch.commit();
        batch = writeBatch(db);
        operationCount = 0;
      }
    }

    if (operationCount > 0) {
      await batch.commit();
    }

    return updatedCount;
  }

  async function handleMigration() {
    // if (currentUserId !== TARGET_USER_ID) {
    //   alert("You are not allowed to run this migration.");
    //   return;
    // }

    const confirmRun = confirm(
      "This will assign ALL tasks and task history to your user account. Run once only?"
    );

    if (!confirmRun) return;

    try {
      setRunning(true);

      const tasksUpdated = await updateCollectionUserId("tasks");
      const historyUpdated = await updateCollectionUserId("taskHistory");

      setDone(true);

      alert(
        `Migration completed.\nTasks updated: ${tasksUpdated}\nTask history updated: ${historyUpdated}`
      );
    } catch (error) {
      console.error("Migration failed:", error);
      alert("Migration failed. Check console and Firestore rules.");
    } finally {
      setRunning(false);
    }
  }

  console.log(
    "MigrationButton rendered with currentUserId:",
    currentUserId,
    TARGET_USER_ID
  );
  //   if (currentUserId !== TARGET_USER_ID) {
  //     return null;
  //   }

  if (done) {
    return (
      <div className="mb-5 rounded-2xl bg-green-100 p-4 text-sm font-semibold text-green-800">
        Migration completed. Remove this button from the code now.
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-2xl border border-red-300 bg-red-50 p-4">
      <p className="mb-3 text-sm font-semibold text-red-800">
        Temporary migration tool. Run once, then remove it.
      </p>

      <button
        type="button"
        onClick={handleMigration}
        disabled={running}
        className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
      >
        {running ? "Updating all data..." : "Assign All Old Data To My User"}
      </button>
    </div>
  );
}
