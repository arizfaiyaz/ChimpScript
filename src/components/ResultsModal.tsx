import { Trophy, X } from "lucide-react";
import type { Duration, TypingResult } from "../types";

type ResultsModalProps = {
  open: boolean;
  latestResult: TypingResult | null;
  results: TypingResult[];
  bestByDuration: Partial<Record<Duration, TypingResult>>;
  onClose: () => void;
  onClear: () => void;
};

const durations: Duration[] = [15, 30, 60, 180, 600];

function formatDuration(duration: Duration) {
  if (duration < 60) {
    return `${duration}s`;
  }

  return `${duration / 60}m`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ResultsModal({
  open,
  latestResult,
  results,
  bestByDuration,
  onClose,
  onClear,
}: ResultsModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[8px] border border-white/10 bg-zinc-950 p-5 shadow-2xl md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-sm uppercase text-lime-300">
              <Trophy size={16} />
              results
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-white">ChimpScript history</h2>
          </div>
          <button
            aria-label="Close results"
            className="rounded-[7px] border border-white/10 p-2 text-zinc-400 transition hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {latestResult && (
          <div className="mt-5 grid gap-3 rounded-[8px] border border-lime-300/20 bg-lime-300/[0.06] p-4 sm:grid-cols-4">
            <div>
              <div className="font-mono text-xs uppercase text-zinc-500">wpm</div>
              <div className="font-mono text-3xl font-semibold text-lime-300">{latestResult.wpm}</div>
            </div>
            <div>
              <div className="font-mono text-xs uppercase text-zinc-500">accuracy</div>
              <div className="font-mono text-3xl font-semibold text-white">{latestResult.accuracy}%</div>
            </div>
            <div>
              <div className="font-mono text-xs uppercase text-zinc-500">chars</div>
              <div className="font-mono text-3xl font-semibold text-white">{latestResult.correctChars}</div>
            </div>
            <div>
              <div className="font-mono text-xs uppercase text-zinc-500">mode</div>
              <div className="font-mono text-3xl font-semibold text-white">
                {formatDuration(latestResult.duration)}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.35fr]">
          <section>
            <h3 className="font-mono text-sm uppercase text-zinc-400">best by time</h3>
            <div className="mt-3 grid gap-2">
              {durations.map((duration) => {
                const best = bestByDuration[duration];

                return (
                  <div
                    className="grid grid-cols-[4rem_1fr_auto] items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.03] px-3 py-2"
                    key={duration}
                  >
                    <span className="font-mono text-sm text-zinc-400">{formatDuration(duration)}</span>
                    <span className="font-mono text-sm text-white">{best ? `${best.wpm} wpm` : "no result"}</span>
                    <span className="font-mono text-xs text-zinc-500">{best ? best.category : ""}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-mono text-sm uppercase text-zinc-400">recent attempts</h3>
              {results.length > 0 && (
                <button
                  className="rounded-[7px] border border-white/10 px-3 py-1.5 font-mono text-xs text-zinc-400 transition hover:text-white"
                  onClick={onClear}
                  type="button"
                >
                  clear
                </button>
              )}
            </div>
            <div className="mt-3 overflow-x-auto">
              {results.length === 0 ? (
                <div className="rounded-[8px] border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-500">
                  No local attempts yet.
                </div>
              ) : (
                <table className="w-full min-w-[34rem] border-separate border-spacing-y-2 text-left font-mono text-sm">
                  <thead className="text-xs uppercase text-zinc-500">
                    <tr>
                      <th className="px-3">date</th>
                      <th className="px-3">wpm</th>
                      <th className="px-3">acc</th>
                      <th className="px-3">mode</th>
                      <th className="px-3">category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 12).map((result) => (
                      <tr className="bg-white/[0.03] text-zinc-200" key={result.id}>
                        <td className="rounded-l-[8px] px-3 py-2 text-zinc-400">{formatDate(result.createdAt)}</td>
                        <td className="px-3 py-2 text-lime-300">{result.wpm}</td>
                        <td className="px-3 py-2">{result.accuracy}%</td>
                        <td className="px-3 py-2">{formatDuration(result.duration)}</td>
                        <td className="rounded-r-[8px] px-3 py-2">{result.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
