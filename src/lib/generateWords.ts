import { wordBanks } from "../data/wordBanks";
import type { Category } from "../types";

const mixedBank = Object.values(wordBanks).flat();

export function generateWords(category: Category, count = 180) {
  const source = category === "Mixed" ? mixedBank : wordBanks[category];

  return Array.from({ length: count }, () => source[Math.floor(Math.random() * source.length)]);
}
