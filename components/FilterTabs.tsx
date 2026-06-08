import { FilterType } from "@/types/todo";

type FilterTabsProps = {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
};

export default function FilterTabs({ filter, setFilter }: FilterTabsProps) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4">
      <FilterButton
        label="All"
        active={filter === "all"}
        onClick={() => setFilter("all")}
      />

      <FilterButton
        label="Not Done"
        active={filter === "not_done"}
        onClick={() => setFilter("not_done")}
      />

      <FilterButton
        label="Partial"
        active={filter === "partial_done"}
        onClick={() => setFilter("partial_done")}
      />

      <FilterButton
        label="Done"
        active={filter === "done"}
        onClick={() => setFilter("done")}
      />
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          : "rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
      }
    >
      {label}
    </button>
  );
}
