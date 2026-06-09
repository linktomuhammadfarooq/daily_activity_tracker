import { TodoStatus, TodoView } from "@/types/todo";
import TodoRow from "./TodoRow";

type TodoListProps = {
  todos: TodoView[];
  loading: boolean;
  onUpdateStatus: (data: {
    taskId: string;
    date: string;
    status: TodoStatus;
    partialText?: string;
  }) => Promise<void>;
  onUpdatePartialText: (data: {
    taskId: string;
    date: string;
    partialText: string;
  }) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
};

export default function TodoList({
  todos,
  loading,
  onUpdateStatus,
  onUpdatePartialText,
  onDeleteTask,
}: TodoListProps) {
  if (loading) {
    return <p className="text-center text-slate-500">Loading tasks...</p>;
  }

  if (todos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
        <p className="font-medium text-slate-700">No tasks found.</p>
        <p className="mt-1 text-sm text-slate-500">
          Add a daily or one-time task for this date.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 hidden grid-cols-[1fr_110px_130px_1.4fr_120px] px-4 text-xs font-bold uppercase text-slate-500 md:grid">
        <p>Todo Name / Priority</p>
        <p>Done</p>
        <p>Not Done</p>
        <p>Partial Done</p>
        <p>Actions</p>
      </div>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <TodoRow
            key={`${todo.taskId}_${todo.date}`}
            todo={todo}
            onUpdateStatus={onUpdateStatus}
            onUpdatePartialText={onUpdatePartialText}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </ul>
    </div>
  );
}
