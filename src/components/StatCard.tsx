type StatCardProps = {
  label: string;
  value: string | number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="font-mono text-[0.68rem] uppercase text-zinc-500">{label}</div>
      <div className="mt-1 font-mono text-xl font-semibold text-white">{value}</div>
    </div>
  );
}
