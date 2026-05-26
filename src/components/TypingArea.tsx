import { cn } from "../lib/utils";

type TypingAreaProps = {
  words: string[];
  typedWords: string[];
  currentInput: string;
  currentIndex: number;
};

function renderCharacters(target: string, typed: string, isCurrent: boolean) {
  const length = Math.max(target.length, typed.length);

  return Array.from({ length }, (_, index) => {
    const targetChar = target[index] ?? "";
    const typedChar = typed[index];
    const isTyped = typedChar !== undefined;
    const isCorrect = typedChar === targetChar;

    return (
      <span
        className={cn(
          "transition-colors",
          !isTyped && "text-zinc-600",
          isTyped && isCorrect && "text-emerald-300",
          isTyped && !isCorrect && "text-red-400",
          isCurrent && !isTyped && "text-zinc-500",
        )}
        key={`${target}-${index}`}
      >
        {targetChar || typedChar}
      </span>
    );
  });
}

export function TypingArea({ words, typedWords, currentInput, currentIndex }: TypingAreaProps) {
  const visibleStart = Math.max(0, currentIndex - 8);
  const visibleWords = words.slice(visibleStart, visibleStart + 54);

  return (
    <section className="min-h-48 rounded-[8px] border border-white/10 bg-black/20 p-5 shadow-2xl shadow-black/20 md:p-7">
      <div className="max-h-52 overflow-hidden font-mono text-2xl leading-[2.35rem] tracking-normal md:text-3xl md:leading-[2.8rem]">
        {visibleWords.map((word, offset) => {
          const index = visibleStart + offset;
          const isCurrent = index === currentIndex;
          const typed = isCurrent ? currentInput : typedWords[index] ?? "";

          return (
            <span
              className={cn(
                "mr-4 inline-block rounded-[6px] border-b-2 border-transparent px-0.5",
                isCurrent && "border-yellow-300 bg-white/[0.04]",
              )}
              key={`${word}-${index}`}
            >
              {renderCharacters(word, typed, isCurrent)}
            </span>
          );
        })}
      </div>
    </section>
  );
}
