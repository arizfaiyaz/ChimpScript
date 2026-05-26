import type { Category, Duration, LiveStats, TypingResult } from "../types";

type StatsInput = {
  words: string[];
  typedWords: string[];
  currentInput?: string;
  duration: Duration;
  category: Category;
  elapsedSeconds?: number;
};

export function calculateStats({
  words,
  typedWords,
  currentInput = "",
  duration,
  category,
  elapsedSeconds,
}: StatsInput): Omit<TypingResult, "id" | "createdAt"> {
  const attempts = [...typedWords];

  if (currentInput.length > 0 || typedWords.length === 0) {
    attempts.push(currentInput);
  }

  let correctChars = 0;
  let incorrectChars = 0;
  let correctWords = 0;
  let incorrectWords = 0;

  attempts.forEach((typed, index) => {
    const target = words[index] ?? "";

    if (!typed) {
      return;
    }

    if (typed === target) {
      correctWords += 1;
    } else {
      incorrectWords += 1;
    }

    for (let charIndex = 0; charIndex < typed.length; charIndex += 1) {
      if (typed[charIndex] === target[charIndex]) {
        correctChars += 1;
      } else {
        incorrectChars += 1;
      }
    }
  });

  const totalTypedCharacters = correctChars + incorrectChars;
  const measuredSeconds = elapsedSeconds && elapsedSeconds > 0 ? elapsedSeconds : duration;
  const minutes = measuredSeconds / 60;
  const wpm = minutes > 0 ? Math.round((correctChars / 5 / minutes) * 100) / 100 : 0;
  const cpm = minutes > 0 ? Math.round((correctChars / minutes) * 100) / 100 : 0;
  const accuracy =
    totalTypedCharacters > 0 ? Math.round((correctChars / totalTypedCharacters) * 10000) / 100 : 0;

  return {
    wpm,
    cpm,
    accuracy,
    correctChars,
    incorrectChars,
    correctWords,
    incorrectWords,
    duration,
    category,
  };
}

export function emptyStats(): LiveStats {
  return {
    wpm: 0,
    cpm: 0,
    accuracy: 0,
    correctChars: 0,
    incorrectChars: 0,
    correctWords: 0,
    incorrectWords: 0,
  };
}
