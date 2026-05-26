import type { Duration } from "../types";
import { cn } from "../lib/utils";

const modes: { label: string; value: Duration }[] = [
  { label: "15s", value: 15 },
  { label: "30s", value: 30 },
  { label: "1m", value: 60 },
  { label: "3m", value: 180 },
  { label: "10m", value: 600 },
];

type TimeSelectorProps = {
  value: Duration;
  onChange: (value: Duration) => void;
};

export function TimeSelector({ value, onChange }: TimeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-xs uppercase text-zinc-500">time</span>
      <div className="flex rounded-[8px] border border-white/10 bg-black/20 p-1">
        {modes.map((mode) => (
          <button
            className={cn(
              "rounded-[6px] px-3 py-2 font-mono text-sm text-zinc-400 transition hover:text-white",
              value === mode.value && "bg-lime-300 text-zinc-950 hover:text-zinc-950",
            )}
            key={mode.value}
            onClick={() => onChange(mode.value)}
            type="button"
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
