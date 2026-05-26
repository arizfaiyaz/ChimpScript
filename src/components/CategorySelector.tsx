import { categories } from "../data/wordBanks";
import type { Category } from "../types";

type CategorySelectorProps = {
  value: Category;
  onChange: (value: Category) => void;
};

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <label className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-xs uppercase text-zinc-500">category</span>
      <select
        className="h-10 rounded-[8px] border border-white/10 bg-black/25 px-3 font-mono text-sm text-zinc-100"
        onChange={(event) => onChange(event.target.value as Category)}
        value={value}
      >
        {categories.map((category) => (
          <option className="bg-zinc-950" key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  );
}
