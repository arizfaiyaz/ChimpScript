import { useCallback, useEffect, useMemo, useState } from "react";
import type { Duration, TypingResult } from "../types";

const STORAGE_KEY = "chimpScriptResults";
const MAX_RESULTS = 50;

function parseResults(raw: string | null): TypingResult[] {
  if (!raw) {
    return [];
  }

  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function useLocalResults() {
  const [results, setResults] = useState<TypingResult[]>([]);

  useEffect(() => {
    setResults(parseResults(window.localStorage.getItem(STORAGE_KEY)));
  }, []);

  const saveResult = useCallback((result: TypingResult) => {
    setResults((current) => {
      const next = [result, ...current].slice(0, MAX_RESULTS);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearResults = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setResults([]);
  }, []);

  const bestByDuration = useMemo(() => {
    return results.reduce<Partial<Record<Duration, TypingResult>>>((best, result) => {
      const previous = best[result.duration];
      if (!previous || result.wpm > previous.wpm) {
        best[result.duration] = result;
      }

      return best;
    }, {});
  }, [results]);

  return {
    results,
    bestByDuration,
    saveResult,
    clearResults,
  };
}
