import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calculateStats, emptyStats } from "../lib/calculateStats";
import { generateWords } from "../lib/generateWords";
import { isSupportedTypingKey, normalizeKey } from "../lib/keyMap";
import type { Category, Duration, TestStatus, TypingResult } from "../types";

type UseTypingTestOptions = {
  duration: Duration;
  category: Category;
  onFinish: (result: TypingResult) => void;
};

const WORD_COUNT = 220;
const ACTIVE_KEY_MS = 150;

function makeResult(stats: Omit<TypingResult, "id" | "createdAt">): TypingResult {
  return {
    ...stats,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

export function useTypingTest({ duration, category, onFinish }: UseTypingTestOptions) {
  const [words, setWords] = useState(() => generateWords(category, WORD_COUNT));
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [status, setStatus] = useState<TestStatus>("idle");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<TypingResult | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const activeKeyTimerRef = useRef<number | null>(null);

  const finishTest = useCallback(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    const stats = calculateStats({
      words,
      typedWords,
      currentInput,
      duration,
      category,
      elapsedSeconds: duration,
    });
    const result = makeResult(stats);

    setStatus("finished");
    setTimeLeft(0);
    setLatestResult(result);
    onFinish(result);
  }, [category, currentInput, duration, onFinish, typedWords, words]);

  const restart = useCallback(() => {
    finishedRef.current = false;
    startedAtRef.current = null;
    setWords(generateWords(category, WORD_COUNT));
    setTypedWords([]);
    setCurrentInput("");
    setCurrentIndex(0);
    setTimeLeft(duration);
    setStatus("idle");
    setActiveKey(null);
    setLatestResult(null);
  }, [category, duration]);

  useEffect(() => {
    restart();
  }, [restart]);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (startedAtRef.current === null) {
        return;
      }

      const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
      const nextTimeLeft = Math.max(duration - elapsed, 0);
      setTimeLeft(nextTimeLeft);

      if (nextTimeLeft <= 0) {
        window.clearInterval(intervalId);
        finishTest();
      }
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [duration, finishTest, status]);

  const flashKey = useCallback((key: string) => {
    setActiveKey(normalizeKey(key));

    if (activeKeyTimerRef.current !== null) {
      window.clearTimeout(activeKeyTimerRef.current);
    }

    activeKeyTimerRef.current = window.setTimeout(() => setActiveKey(null), ACTIVE_KEY_MS);
  }, []);

  const startIfNeeded = useCallback(() => {
    if (status === "idle") {
      startedAtRef.current = Date.now();
      setStatus("running");
    }
  }, [status]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (status === "finished" || !isSupportedTypingKey(event)) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) {
        return;
      }

      const { key } = event;
      flashKey(key);

      if (key === "Tab" || key === "Enter" || key === " ") {
        event.preventDefault();
      }

      if (key === "Backspace") {
        event.preventDefault();
        if (currentInput.length > 0) {
          setCurrentInput((value) => value.slice(0, -1));
          return;
        }

        if (typedWords.length > 0) {
          setCurrentInput(typedWords[typedWords.length - 1]);
          setTypedWords((value) => value.slice(0, -1));
          setCurrentIndex((index) => Math.max(0, index - 1));
        }
        return;
      }

      if (key === " " || key === "Enter" || key === "Tab") {
        if (currentInput.length === 0) {
          return;
        }

        setTypedWords((value) => [...value, currentInput]);
        setCurrentInput("");
        setCurrentIndex((value) => value + 1);
        return;
      }

      if (key.length === 1) {
        event.preventDefault();
        startIfNeeded();
        setCurrentInput((value) => value + key);
      }
    },
    [currentInput, flashKey, startIfNeeded, status, typedWords],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    return () => {
      if (activeKeyTimerRef.current !== null) {
        window.clearTimeout(activeKeyTimerRef.current);
      }
    };
  }, []);

  const liveStats = useMemo(() => {
    if (status === "idle" && typedWords.length === 0 && currentInput.length === 0) {
      return emptyStats();
    }

    const elapsed = status === "running" && startedAtRef.current ? (Date.now() - startedAtRef.current) / 1000 : duration;
    return calculateStats({
      words,
      typedWords,
      currentInput,
      duration,
      category,
      elapsedSeconds: Math.max(elapsed, 1),
    });
  }, [category, currentInput, duration, status, typedWords, words]);

  return {
    words,
    typedWords,
    currentInput,
    currentIndex,
    timeLeft,
    status,
    activeKey,
    latestResult,
    liveStats,
    restart,
    finishTest,
  };
}
