export type TodoStatus = "done" | "not_done" | "partial_done";

export type ScheduleType = "daily" | "one_time";

export type FilterType = "all" | "done" | "not_done" | "partial_done";

export type Task = {
  id: string;
  userId: string;
  title: string;
  scheduleType: ScheduleType;
  priority: number;
  startDate: string;
  taskDate: string | null;
  isActive: boolean;
  createdAt?: number;
};

export type TaskHistory = {
  id: string;
  userId: string;
  taskId: string;
  date: string;
  status: TodoStatus;
  partialText: string;
  updatedAt?: number;
};

export type TodoView = {
  taskId: string;
  userId: string;
  title: string;
  scheduleType: ScheduleType;
  priority: number;
  startDate: string;
  taskDate: string | null;
  date: string;
  status: TodoStatus;
  partialText: string;
};
