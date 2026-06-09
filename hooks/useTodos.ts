"use client";

import { db } from "@/lib/firebase";
import {
  ScheduleType,
  Task,
  TaskHistory,
  TodoStatus,
  TodoView,
} from "@/types/todo";
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

export function useTodos(selectedDate: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<TaskHistory[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const tasksRef = collection(db, "tasks");

    const unsubscribe = onSnapshot(
      tasksRef,
      (snapshot) => {
        const items: Task[] = snapshot.docs.map((docItem) => {
          const data = docItem.data();

          return {
            id: docItem.id,
            title: data.title || "",
            scheduleType: data.scheduleType || "one_time",
            priority: Number(data.priority) || 1,
            startDate: data.startDate || "",
            taskDate: data.taskDate || null,
            isActive: data.isActive ?? true,
            createdAt: data.createdAt?.toMillis?.() || 0,
          };
        });

        setTasks(items);
        setLoadingTasks(false);
      },
      (error) => {
        console.error("Tasks Firestore error:", error);
        setLoadingTasks(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const historyRef = collection(db, "taskHistory");

    const q = query(historyRef, where("date", "==", selectedDate));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: TaskHistory[] = snapshot.docs.map((docItem) => {
          const data = docItem.data();

          return {
            id: docItem.id,
            taskId: data.taskId || "",
            date: data.date || "",
            status: data.status || "not_done",
            partialText: data.partialText || "",
            updatedAt: data.updatedAt?.toMillis?.() || 0,
          };
        });

        setHistory(items);
        setLoadingHistory(false);
      },
      (error) => {
        console.error("Task history Firestore error:", error);
        setLoadingHistory(false);
      }
    );

    return () => unsubscribe();
  }, [selectedDate]);

  const todos = useMemo<TodoView[]>(() => {
    const historyByTaskId = new Map<string, TaskHistory>();

    history.forEach((item) => {
      historyByTaskId.set(item.taskId, item);
    });

    const visibleTasks = tasks.filter((task) => {
      if (!task.isActive) return false;

      // Do not show any task before its start date
      if (!task.startDate || selectedDate < task.startDate) {
        return false;
      }

      // Daily tasks show from startDate onward
      if (task.scheduleType === "daily") {
        return selectedDate >= task.startDate;
      }

      // One-time tasks show only on taskDate,
      // but also only if startDate has been reached
      return task.taskDate === selectedDate;
    });

    const mergedTodos = visibleTasks.map((task) => {
      const taskHistory = historyByTaskId.get(task.id);

      return {
        taskId: task.id,
        title: task.title,
        scheduleType: task.scheduleType,
        priority: Number(task.priority) || 1,
        startDate: task.startDate,
        taskDate: task.taskDate,
        date: selectedDate,
        status: taskHistory?.status || "not_done",
        partialText: taskHistory?.partialText || "",
      };
    });

    const statusRank = {
      not_done: 1,
      partial_done: 2,
      done: 3,
    };

    mergedTodos.sort((a, b) => {
      // 1. Not done first, partial second, done last
      const statusDifference = statusRank[a.status] - statusRank[b.status];

      if (statusDifference !== 0) {
        return statusDifference;
      }

      // 2. Highest priority first inside each status group
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }

      // 3. Daily tasks before one-time if status and priority are same
      if (a.scheduleType !== b.scheduleType) {
        return a.scheduleType === "daily" ? -1 : 1;
      }

      // 4. Alphabetical fallback
      return a.title.localeCompare(b.title);
    });

    return mergedTodos;
  }, [tasks, history, selectedDate]);

  async function addTask({
    title,
    scheduleType,
    taskDate,
    priority,
  }: {
    title: string;
    scheduleType: ScheduleType;
    taskDate: string;
    priority: number;
  }) {
    const cleanTitle = title.trim();

    if (!cleanTitle) return;

    await addDoc(collection(db, "tasks"), {
      title: cleanTitle,
      scheduleType,
      priority,
      startDate: taskDate,
      taskDate: scheduleType === "one_time" ? taskDate : null,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function updateTaskStatus({
    taskId,
    date,
    status,
    partialText = "",
  }: {
    taskId: string;
    date: string;
    status: TodoStatus;
    partialText?: string;
  }) {
    const historyId = `${taskId}_${date}`;

    await setDoc(
      doc(db, "taskHistory", historyId),
      {
        taskId,
        date,
        status,
        partialText: status === "partial_done" ? partialText : "",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  async function updatePartialText({
    taskId,
    date,
    partialText,
  }: {
    taskId: string;
    date: string;
    partialText: string;
  }) {
    const cleanPartialText = partialText.trim();

    if (!cleanPartialText) return;

    const historyId = `${taskId}_${date}`;

    await setDoc(
      doc(db, "taskHistory", historyId),
      {
        taskId,
        date,
        status: "partial_done",
        partialText: cleanPartialText,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  async function deleteTask(taskId: string) {
    await deleteDoc(doc(db, "tasks", taskId));
  }

  async function archiveTask(taskId: string) {
    await updateDoc(doc(db, "tasks", taskId), {
      isActive: false,
      updatedAt: serverTimestamp(),
    });
  }

  return {
    todos,
    loading: loadingTasks || loadingHistory,
    addTask,
    updateTaskStatus,
    updatePartialText,
    deleteTask,
    archiveTask,
  };
}
