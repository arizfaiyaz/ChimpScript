import type { Duration, TypingResult } from "../types";

export type ProfileStats = {
  totalAttempts: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalCorrectWords: number;
  totalTypedCharacters: number;
  currentStreak: number;
  longestStreak: number;
  mostUsedCategory: string;
  bestTimeMode: string;
};

export type ActivityDay = {
  date: string;
  label: string;
  attempts: number;
};

export type ActivityCell = ActivityDay & {
  isPadding: boolean;
};

export type ActivityMonthLabel = {
  column: number;
  label: string;
};

export type ActivityGrid = {
  cells: ActivityCell[];
  columns: number;
  monthLabels: ActivityMonthLabel[];
  year: number;
};

const durationLabels: Partial<Record<Duration, string>> = {
  15: "15s",
  30: "30s",
  60: "1m",
  180: "3m",
  600: "10m",
};

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + days);
  return next;
}

function getResultDateKey(result: TypingResult) {
  const date = new Date(result.createdAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return toDateKey(date);
}

function formatGraphDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDurationMode(duration: unknown) {
  if (typeof duration !== "number" || !Number.isFinite(duration)) {
    return "0s";
  }

  if (duration in durationLabels) {
    return durationLabels[duration as Duration] ?? `${duration}s`;
  }

  return duration < 60 ? `${duration}s` : `${Math.round((duration / 60) * 10) / 10}m`;
}

export function getAttemptsByDate(results: TypingResult[]) {
  return results.reduce<Record<string, number>>((attempts, result) => {
    const key = getResultDateKey(result);

    if (key) {
      attempts[key] = (attempts[key] ?? 0) + 1;
    }

    return attempts;
  }, {});
}

export function getCurrentStreak(attemptsByDate: Record<string, number>) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let cursor = today;

  while (attemptsByDate[toDateKey(cursor)] > 0) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function getLongestStreak(attemptsByDate: Record<string, number>) {
  const days = Object.keys(attemptsByDate)
    .filter((date) => attemptsByDate[date] > 0)
    .sort();

  if (days.length === 0) {
    return 0;
  }

  let longest = 1;
  let current = 1;

  for (let index = 1; index < days.length; index += 1) {
    const previous = new Date(`${days[index - 1]}T00:00:00`);
    const next = new Date(`${days[index]}T00:00:00`);
    const difference = Math.round((next.getTime() - previous.getTime()) / 86400000);

    if (difference === 1) {
      current += 1;
    } else {
      current = 1;
    }

    longest = Math.max(longest, current);
  }

  return longest;
}

export function getMostUsedCategory(results: TypingResult[]) {
  const counts = results.reduce<Record<string, number>>((items, result) => {
    const category = typeof result.category === "string" && result.category.trim() ? result.category : "Mixed";
    items[category] = (items[category] ?? 0) + 1;
    return items;
  }, {});

  return Object.entries(counts).sort((first, second) => second[1] - first[1])[0]?.[0] ?? "None";
}

export function getBestTimeMode(results: TypingResult[]) {
  const best = results.reduce<TypingResult | null>((winner, result) => {
    if (!winner || asNumber(result.wpm) > asNumber(winner.wpm)) {
      return result;
    }

    return winner;
  }, null);

  return best ? formatDurationMode(best.duration) : "None";
}

export function getActivityDays(attemptsByDate: Record<string, number>, dayCount = 91) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = addDays(today, -(dayCount - 1));

  return Array.from({ length: dayCount }, (_, index): ActivityDay => {
    const date = addDays(start, index);
    const key = toDateKey(date);

    return {
      date: key,
      label: formatGraphDate(date),
      attempts: attemptsByDate[key] ?? 0,
    };
  });
}

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);
  start.setHours(0, 0, 0, 0);

  return Math.round((date.getTime() - start.getTime()) / 86400000);
}

export function getCurrentYearActivityGrid(
  attemptsByDate: Record<string, number>,
  year = new Date().getFullYear(),
): ActivityGrid {
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);
  firstDay.setHours(0, 0, 0, 0);
  lastDay.setHours(0, 0, 0, 0);

  const leadingDays = firstDay.getDay();
  const dayCount = getDayOfYear(lastDay) + 1;
  const columns = Math.ceil((leadingDays + dayCount) / 7);
  const slotCount = columns * 7;
  const cells = Array.from({ length: slotCount }, (_, index): ActivityCell => {
    const dayIndex = index - leadingDays;

    if (dayIndex < 0 || dayIndex >= dayCount) {
      return {
        date: `padding-${index}`,
        label: "",
        attempts: 0,
        isPadding: true,
      };
    }

    const date = addDays(firstDay, dayIndex);
    const key = toDateKey(date);

    return {
      date: key,
      label: formatGraphDate(date),
      attempts: attemptsByDate[key] ?? 0,
      isPadding: false,
    };
  });

  const monthLabels = Array.from({ length: 12 }, (_, month): ActivityMonthLabel => {
    const date = new Date(year, month, 1);
    const column = Math.floor((leadingDays + getDayOfYear(date)) / 7) + 1;

    return {
      column,
      label: new Intl.DateTimeFormat(undefined, { month: "short" }).format(date),
    };
  });

  return {
    cells,
    columns,
    monthLabels,
    year,
  };
}

export function getProfileStats(results: TypingResult[]): ProfileStats {
  const attemptsByDate = getAttemptsByDate(results);
  const totalAttempts = results.length;
  const totals = results.reduce(
    (values, result) => {
      const correctChars = asNumber(result.correctChars);
      const incorrectChars = asNumber(result.incorrectChars);

      return {
        wpm: values.wpm + asNumber(result.wpm),
        accuracy: values.accuracy + asNumber(result.accuracy),
        correctWords: values.correctWords + asNumber(result.correctWords),
        typedCharacters: values.typedCharacters + correctChars + incorrectChars,
        bestWpm: Math.max(values.bestWpm, asNumber(result.wpm)),
      };
    },
    {
      wpm: 0,
      accuracy: 0,
      correctWords: 0,
      typedCharacters: 0,
      bestWpm: 0,
    },
  );

  return {
    totalAttempts,
    bestWpm: Math.round(totals.bestWpm),
    averageWpm: totalAttempts > 0 ? Math.round(totals.wpm / totalAttempts) : 0,
    averageAccuracy: totalAttempts > 0 ? Math.round(totals.accuracy / totalAttempts) : 0,
    totalCorrectWords: Math.round(totals.correctWords),
    totalTypedCharacters: Math.round(totals.typedCharacters),
    currentStreak: getCurrentStreak(attemptsByDate),
    longestStreak: getLongestStreak(attemptsByDate),
    mostUsedCategory: getMostUsedCategory(results),
    bestTimeMode: getBestTimeMode(results),
  };
}
