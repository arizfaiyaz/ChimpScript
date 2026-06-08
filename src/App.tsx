import { BarChart3, RotateCcw, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { CategorySelector } from "./components/CategorySelector";
import { Header } from "./components/Header";
import { KeyboardDisplay } from "./components/KeyboardDisplay";
import { ProfileModal } from "./components/ProfileModal";
import { ResultsModal } from "./components/ResultsModal";
import { StatCard } from "./components/StatCard";
import { ThemeToggle } from "./components/ThemeToggle";
import { TimeSelector } from "./components/TimeSelector";
import { TypingArea } from "./components/TypingArea";
import { useLocalResults } from "./hooks/useLocalResults";
import { useTypingTest } from "./hooks/useTypingTest";
import type { Category, Duration } from "./types";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export default function App() {
  const [duration, setDuration] = useState<Duration>(30);
  const [category, setCategory] = useState<Category>("Mixed");
  const [resultsOpen, setResultsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return window.localStorage.getItem("chimpScriptTheme") === "light" ? "light" : "dark";
  });
  const { results, bestByDuration, saveResult, clearResults } = useLocalResults();
  const test = useTypingTest({
    duration,
    category,
    onFinish: (result) => {
      saveResult(result);
      setResultsOpen(true);
    },
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    window.localStorage.setItem("chimpScriptTheme", theme);
  }, [theme]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 md:px-8">
      <Header />

      <div className="flex flex-1 flex-col justify-between gap-7 py-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <TimeSelector value={duration} onChange={setDuration} />
            <CategorySelector value={category} onChange={setCategory} />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={() => setTheme((value) => (value === "dark" ? "light" : "dark"))} />
            <button
              className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-sm text-zinc-200 transition hover:border-lime-300/40 hover:text-white"
              onClick={test.restart}
              type="button"
            >
              <RotateCcw size={16} />
              Restart
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-sm text-zinc-200 transition hover:border-lime-300/40 hover:text-white"
              onClick={() => setResultsOpen(true)}
              type="button"
            >
              <BarChart3 size={16} />
              Results
            </button>
            <button
              className="profile-button inline-flex items-center gap-2 rounded-[8px] border border-lime-300/25 bg-lime-300/[0.07] px-4 py-2 font-mono text-sm text-lime-200 transition hover:border-lime-300/60 hover:text-white"
              onClick={() => setProfileOpen(true)}
              type="button"
            >
              <UserRound size={16} />
              Profile
            </button>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="time" value={formatTime(test.timeLeft)} />
          <StatCard label="wpm" value={test.liveStats.wpm} />
          <StatCard label="accuracy" value={`${test.liveStats.accuracy}%`} />
          <StatCard label="correct chars" value={test.liveStats.correctChars} />
          <StatCard label="incorrect chars" value={test.liveStats.incorrectChars} />
        </section>

        <TypingArea
          currentIndex={test.currentIndex}
          currentInput={test.currentInput}
          typedWords={test.typedWords}
          words={test.words}
        />

        <KeyboardDisplay activeKey={test.activeKey} />
      </div>

      <ResultsModal
        bestByDuration={bestByDuration}
        latestResult={test.latestResult}
        onClear={clearResults}
        onClose={() => setResultsOpen(false)}
        open={resultsOpen}
        results={results}
      />
      <ProfileModal onClose={() => setProfileOpen(false)} open={profileOpen} results={results} />
    </main>
  );
}
