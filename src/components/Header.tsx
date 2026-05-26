import { Code2 } from "lucide-react";

export function Header() {
  return (
    <header className="flex flex-col gap-5 border-b border-white/10 py-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-[8px] border border-lime-300/30 bg-lime-300/10 text-lime-300">
          <Code2 size={20} />
        </div>
        <div>
          <h1 className="font-mono text-2xl font-semibold tracking-normal text-white">ChimpScript</h1>
          <p className="mt-1 text-sm text-zinc-400">Practice typing code syntax faster.</p>
        </div>
      </div>
    </header>
  );
}
