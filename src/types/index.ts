export type Duration = 15 | 30 | 60 | 180 | 600;

export type Category =
  | "Mixed"
  | "C"
  | "C++"
  | "Java"
  | "Python"
  | "JavaScript"
  | "TypeScript"
  | "React"
  | "Node.js"
  | "SQL"
  | "HTML/CSS";

export type TestStatus = "idle" | "running" | "finished";

export type TypingResult = {
  id: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  correctWords: number;
  incorrectWords: number;
  duration: Duration;
  category: Category;
  createdAt: string;
};

export type LiveStats = Pick<
  TypingResult,
  "wpm" | "cpm" | "accuracy" | "correctChars" | "incorrectChars" | "correctWords" | "incorrectWords"
>;
