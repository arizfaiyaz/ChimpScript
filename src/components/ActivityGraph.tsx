import { getCurrentYearActivityGrid } from "../lib/profileStats";

type ActivityGraphProps = {
  attemptsByDate: Record<string, number>;
};

function getIntensity(attempts: number) {
  if (attempts >= 7) {
    return "bg-[#39d353] shadow-[0_0_10px_rgba(57,211,83,0.28)]";
  }

  if (attempts >= 4) {
    return "bg-[#26a641]";
  }

  if (attempts >= 2) {
    return "bg-[#006d32]";
  }

  if (attempts === 1) {
    return "bg-[#0e4429]";
  }

  return "bg-[#161b22]";
}

export function ActivityGraph({ attemptsByDate }: ActivityGraphProps) {
  const graph = getCurrentYearActivityGrid(attemptsByDate);

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[0.65rem] uppercase text-zinc-500">activity</p>
          <h3 className="mt-0.5 font-mono text-sm font-semibold text-white">{graph.year} activity</h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[0.66rem] uppercase text-zinc-500">
          <span>less</span>
          {[0, 1, 3, 5, 8].map((value) => (
            <span className={`size-[11px] rounded-[2px] ${getIntensity(value)}`} key={value} />
          ))}
          <span>more</span>
        </div>
      </div>

      <div className="pb-1">
        <div
          className="mb-1 grid gap-[3px] font-mono text-[0.6rem] text-zinc-500"
          style={{ gridTemplateColumns: `repeat(${graph.columns}, minmax(0, 1fr))` }}
        >
          {graph.monthLabels.map((month) => (
            <span className="truncate" key={month.label} style={{ gridColumn: `${month.column} / span 4` }}>
              {month.label}
            </span>
          ))}
        </div>
        <div
          className="grid grid-flow-col grid-rows-7 gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${graph.columns}, minmax(0, 1fr))` }}
        >
          {graph.cells.map((day) => (
            <span
              aria-hidden={day.isPadding}
              aria-label={
                day.isPadding
                  ? undefined
                  : `${day.attempts} ${day.attempts === 1 ? "attempt" : "attempts"} on ${day.label}`
              }
              className={`aspect-square rounded-[2px] ${day.isPadding ? "invisible" : getIntensity(day.attempts)}`}
              key={day.date}
              title={
                day.isPadding
                  ? undefined
                  : `${day.attempts} ${day.attempts === 1 ? "attempt" : "attempts"} on ${day.label}`
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
