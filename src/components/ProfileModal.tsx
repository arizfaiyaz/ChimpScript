import { useState } from "react";
import { Download, X } from "lucide-react";
import { downloadProfileCardAsPng } from "../lib/downloadCard";
import type { TypingResult } from "../types";
import { ProfileCard } from "./ProfileCard";

type ProfileModalProps = {
  open: boolean;
  results: TypingResult[];
  onClose: () => void;
};

export function ProfileModal({ open, results, onClose }: ProfileModalProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  async function handleDownload() {
    setGenerating(true);
    setError(null);

    try {
      await downloadProfileCardAsPng(results, "chimpscript-profile.png");
    } catch {
      setError("Could not generate the card image. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[860px] py-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="mr-auto">
            <p className="font-mono text-xs uppercase text-lime-300">Profile card</p>
            {error && <p className="mt-1 text-sm text-red-300">{error}</p>}
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-[8px] border border-lime-300/30 bg-lime-300/10 px-4 py-2 font-mono text-sm text-lime-200 transition hover:border-lime-300/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={generating}
            onClick={handleDownload}
            type="button"
          >
            <Download size={16} />
            {generating ? "Generating..." : "Download Card"}
          </button>
          <button
            aria-label="Close profile"
            className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-sm text-zinc-300 transition hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
            Close
          </button>
        </div>

        <ProfileCard results={results} />
      </div>
    </div>
  );
}
