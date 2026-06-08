import { forwardRef } from "react";
import { Code2, Flame, GitBranch, Keyboard, Trophy } from "lucide-react";
import { ActivityGraph } from "./ActivityGraph";
import { getAttemptsByDate, getProfileStats } from "../lib/profileStats";
import type { TypingResult } from "../types";

type ProfileCardProps = {
  results: TypingResult[];
};

type StatTileProps = {
  label: string;
  value: string | number;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value);
}

function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-white/[0.045] px-3 py-2.5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
      <p className="font-mono text-[0.62rem] uppercase text-zinc-500">{label}</p>
      <p className="mt-1 truncate font-mono text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export const ProfileCard = forwardRef<HTMLDivElement, ProfileCardProps>(({ results }, ref) => {
  const stats = getProfileStats(results);
  const attemptsByDate = getAttemptsByDate(results);
  const hasResults = results.length > 0;

  return (
    <article
      className="profile-share-card relative min-h-[500px] w-full max-w-[820px] overflow-hidden rounded-[8px] border border-lime-300/20 bg-[#090d0a] p-4 text-white shadow-2xl sm:p-5"
      ref={ref}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(190,242,100,0.16),transparent_32%),radial-gradient(circle_at_86%_12%,rgba(250,204,21,0.13),transparent_27%),linear-gradient(180deg,rgba(255,255,255,0.055),transparent_34%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-300/80 to-transparent" />

      <div className="relative flex min-h-[452px] flex-col gap-4">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-lime-300/40 bg-lime-300/12 text-lime-300 shadow-[0_0_20px_rgba(190,242,100,0.14)]">
              <Code2 size={20} />
            </div>
            <div>
              <p className="font-mono text-[0.68rem] uppercase text-lime-300">Developer Typing Profile</p>
              <h2 className="mt-0.5 font-mono text-2xl font-semibold leading-tight tracking-normal text-white">
                ChimpScript
              </h2>
            </div>
          </div>
        </header>

        {hasResults ? (
          <>
            <section className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile label="attempts" value={formatNumber(stats.totalAttempts)} />
              <StatTile label="best wpm" value={stats.bestWpm} />
              <StatTile label="avg wpm" value={stats.averageWpm} />
              <StatTile label="avg accuracy" value={`${stats.averageAccuracy}%`} />
              <StatTile label="correct words" value={formatNumber(stats.totalCorrectWords)} />
              <StatTile label="typed chars" value={formatNumber(stats.totalTypedCharacters)} />
              <StatTile label="current streak" value={`${stats.currentStreak}d`} />
              <StatTile label="longest streak" value={`${stats.longestStreak}d`} />
            </section>

            <section className="grid gap-2.5 md:grid-cols-3">
              <div className="flex items-center gap-2.5 rounded-[8px] border border-white/10 bg-black/20 p-3">
                <Keyboard className="text-lime-300" size={17} />
                <div className="min-w-0">
                  <p className="font-mono text-[0.6rem] uppercase text-zinc-500">most used category</p>
                  <p className="truncate font-mono text-sm font-semibold text-white">{stats.mostUsedCategory}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-[8px] border border-white/10 bg-black/20 p-3">
                <Trophy className="text-yellow-300" size={17} />
                <div className="min-w-0">
                  <p className="font-mono text-[0.6rem] uppercase text-zinc-500">best time mode</p>
                  <p className="truncate font-mono text-sm font-semibold text-white">{stats.bestTimeMode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-[8px] border border-white/10 bg-black/20 p-3">
                <Flame className="text-lime-300" size={17} />
                <div className="min-w-0">
                  <p className="font-mono text-[0.6rem] uppercase text-zinc-500">share line</p>
                  <p className="truncate font-mono text-sm font-semibold text-white">
                    {stats.bestWpm} wpm peak
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="flex min-h-[150px] items-center justify-center rounded-[8px] border border-dashed border-lime-300/20 bg-black/20 p-5 text-center">
            <div>
              <GitBranch className="mx-auto text-lime-300" size={24} />
              <h3 className="mt-3 font-mono text-lg font-semibold text-white">No attempts yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
                Complete a typing test to build your ChimpScript profile.
              </p>
            </div>
          </section>
        )}

        <section className="rounded-[8px] border border-white/10 bg-black/25 p-3">
          <ActivityGraph attemptsByDate={attemptsByDate} />
        </section>

        <footer className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-3 font-mono text-[0.68rem] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Built with <span className="text-lime-300">ChimpScript</span>
          </span>
          <span>https://chimpscript.vercel.app/</span>
        </footer>
      </div>
    </article>
  );
});

ProfileCard.displayName = "ProfileCard";
