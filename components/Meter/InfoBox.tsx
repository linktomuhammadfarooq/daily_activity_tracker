export default function InfoBox({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-purple-50 p-3">
      <p className="text-xs font-semibold uppercase text-purple-700">{label}</p>

      <p className="mt-1 text-xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
