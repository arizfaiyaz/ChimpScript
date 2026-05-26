import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  theme: "dark" | "light";
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isLight = theme === "light";

  return (
    <button
      aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
      className="inline-flex size-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.03] text-zinc-200 transition hover:border-lime-300/40 hover:text-white"
      onClick={onToggle}
      type="button"
    >
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
