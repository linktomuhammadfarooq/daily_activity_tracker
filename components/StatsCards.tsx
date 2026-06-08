import { TodoView } from "@/types/todo";

type StatsCardsProps = {
  todos: TodoView[];
};

export default function StatsCards({ todos }: StatsCardsProps) {
  const totalTasks = todos.length;
  const doneTasks = todos.filter((todo) => todo.status === "done").length;
  const notDoneTasks = todos.filter(
    (todo) => todo.status === "not_done"
  ).length;
  const partialTasks = todos.filter(
    (todo) => todo.status === "partial_done"
  ).length;

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className="rounded-2xl bg-slate-100 p-4">
        <p className="text-sm text-slate-500">All</p>
        <p className="text-2xl font-bold text-slate-900">{totalTasks}</p>
      </div>

      <div className="rounded-2xl bg-green-100 p-4">
        <p className="text-sm text-green-700">Done</p>
        <p className="text-2xl font-bold text-green-800">{doneTasks}</p>
      </div>

      <div className="rounded-2xl bg-orange-100 p-4">
        <p className="text-sm text-orange-700">Not Done</p>
        <p className="text-2xl font-bold text-orange-800">{notDoneTasks}</p>
      </div>

      <div className="rounded-2xl bg-yellow-100 p-4">
        <p className="text-sm text-yellow-700">Partial</p>
        <p className="text-2xl font-bold text-yellow-800">{partialTasks}</p>
      </div>
    </div>
  );
}
